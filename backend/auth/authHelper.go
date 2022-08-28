package auth

import (
	"database/sql"

	"context"
	"fmt"
	"net/http"
	"os"
	"time"
	"io"

	"github.com/cloudinary/cloudinary-go"
	"github.com/cloudinary/cloudinary-go/api/uploader"
	"github.com/joho/godotenv"
	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"

	"github.com/bojie/orbital/backend/db"
	"github.com/gin-gonic/gin"
)



type User struct {
	ID            uint   `json:"uid" form:"uid""` 
	Name          string `json:"username" form:"username"`
	Password      string `json:"password" form:"password"`
	Refresh_token string `json:"refresh_token" form:"refresh_token"`
	Token         string `json:"token" form:"token"`
	Email         string `json:"email" form:"email"`
	ProfilePicUrl string `json:"profile_pic"`
	Dob           string `json:"dob" form:"dob"`
}

func HashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		fmt.Println(err)
	}
	return string(bytes)
}

func VerifyPassword(userPassword string, providedPassword string) (bool, string) {
	err := bcrypt.CompareHashAndPassword([]byte(providedPassword), []byte(userPassword))
	check := true
	msg := ""

	if err != nil {
		msg = fmt.Sprintf("email of password is incorrect")
		check = false
	}

	return check, msg
}

func ImageUploadHelper(data io.Reader) (string, error) {

		err := godotenv.Load()
        ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
        defer cancel()
	

        //create cloudinary instance
        cld, err := cloudinary.NewFromParams(os.Getenv("CLOUDINARY_CLOUD_NAME"),os.Getenv("CLOUDINARY_API_KEY") ,os.Getenv("CLOUDINARY_API_SECRET"))
        if err != nil {
            return "", err
        }

        //upload file
        uploadParam, err := cld.Upload.Upload(ctx,data , uploader.UploadParams{Folder: os.Getenv("CLOUDINARY_UPLOAD_FOLDER")})
        if err != nil {
			fmt.Println(err.Error())
            return "", err
        }
        return uploadParam.SecureURL, nil
          
    }



func Signup() gin.HandlerFunc {
	return func(c *gin.Context) {
		var user User

		if err := c.Bind(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid Request"})
			return
		}

		file, _, err1 := c.Request.FormFile("profilePic") 
		
		if err1 != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "parsefolderfail"})
			return
		}

		

		token, refreshToken, _ := GenerateAllTokens(user.Name)
		user.Token = token
		user.Refresh_token = refreshToken

		password := HashPassword(user.Password)
		user.Password = password

		result, err := db.DB.Exec("INSERT INTO users (name,password,refresh_token,token,verified,email,dob) VALUES ($1, $2, $3,$4,$5,$6,$7)", user.Name, user.Password, user.Refresh_token, user.Token, false, user.Email,user.Dob)

		if err != nil {
			if error_code, ok := err.(*pq.Error); ok {
				if error_code.Code == "23505" {
					c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "This username is already in use, please choose another one"})
					return
				}
			}

			c.IndentedJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
			return
		}

		url,err4 := ImageUploadHelper(file)

		if err4 !=nil{
			c.JSON(http.StatusBadRequest, gin.H{"message": err4.Error()})
			return
		}

		result,err = db.DB.Exec("UPDATE users SET profile_pic_url = $1 WHERE (name=$2)",url,user.Name)
		if err != nil {

			c.IndentedJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
			return
		}

		c.IndentedJSON(http.StatusOK, result)
	}
}

func Login() gin.HandlerFunc {
	return func(c *gin.Context) {
		var user User
		var foundUser User
		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		row := db.DB.QueryRow("SELECT uid,name,password,token,refresh_token FROM users WHERE (name = $1)", user.Name)

		if err := row.Scan(&foundUser.ID, &foundUser.Name, &foundUser.Password, &foundUser.Token, &foundUser.Refresh_token); err != nil {
			if err == sql.ErrNoRows {
				c.JSON(http.StatusBadRequest, gin.H{"message": "password or username incorrect"})
				return
			}

			c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})

			return
		} 

		check_password, _ := VerifyPassword(user.Password, foundUser.Password)
		if !check_password {
			c.JSON(http.StatusBadRequest, gin.H{"message": "password or username incorrect"})
			return
		}

		token, refreshToken, err := GenerateAllTokens(foundUser.Name)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
			return
		}



		UpdateAllTokens(token, refreshToken, foundUser.ID)

		newrow := db.DB.QueryRow("SELECT uid,name,password,token,refresh_token FROM users WHERE (name = $1)", user.Name)

		if err := newrow.Scan(&foundUser.ID, &foundUser.Name, &foundUser.Password, &foundUser.Token, &foundUser.Refresh_token); err != nil {
			if err == sql.ErrNoRows {
				c.JSON(http.StatusBadRequest, gin.H{"message": "password or username incorrect error"})
				return
			}
			c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
			return
		}

		type response struct {
			ID            uint   `json:"uid"`
			Name          string `json:"username"`
			Refresh_token string `json:"refresh_token"`
			Token         string `json:"token"`
		}

		var json_response response
		json_response.Name = foundUser.Name
		json_response.ID = foundUser.ID
		json_response.Refresh_token = foundUser.Refresh_token
		json_response.Token = foundUser.Token
		
		c.SetCookie("refresh_token",foundUser.Refresh_token,60*60*24,"/","",false,true)


		c.JSON(http.StatusOK, json_response)
	}

}

func GetAccessToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		refresh_token, err := c.Cookie("refresh_token")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error":"No Authorization Header provided"})
			c.Abort()
			return
		}
		claims, err1 := ValidateToken(refresh_token)
		if err1 != "" {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Token is either invalid or expired"})
			c.Abort()
			return
		}

		newrow := db.DB.QueryRow("SELECT refresh_token FROM users WHERE (name = $1)", claims.Name)

		var foundRefreshToken string

		if err := newrow.Scan(&foundRefreshToken); err != nil {
			if err == sql.ErrNoRows {
				c.JSON(http.StatusBadRequest, gin.H{"message": "password or username incorrect error"})
				return
			}

			c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
			return
		}

		if foundRefreshToken != refresh_token {
			c.JSON(http.StatusBadRequest, gin.H{"message": "unauthorized token"})
			return
		}

		newAccessToken,err := GenerateAccessToken(claims.Name)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
			return
		}
		
		_,err = db.DB.Exec("UPDATE users SET token = $1 WHERE (name=$2)",newAccessToken,claims.Name)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
			return
		}



		c.IndentedJSON(http.StatusOK,struct{Token string}{newAccessToken})

	}
}
