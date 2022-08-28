package user

import (
	"database/sql"
	"net/http"

	"github.com/bojie/orbital/backend/auth"
	"github.com/bojie/orbital/backend/db"
	"github.com/gin-gonic/gin"
)

func GetUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		var user auth.User

		 
		name := c.GetString("name")

		row := db.DB.QueryRow("SELECT uid,name,token,profile_pic_url,dob,email FROM users WHERE name = $1", name)

		if err := row.Scan(&user.ID, &user.Name, &user.Token,&user.ProfilePicUrl,&user.Dob,&user.Email); err != nil {
			if err == sql.ErrNoRows {
				c.IndentedJSON(http.StatusNotFound, gin.H{"message": "no row"})
				return
			}

			c.IndentedJSON(http.StatusNotFound, gin.H{"message": err.Error()})
			return
		}

		if user.Token != c.GetString("token") {
			c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Unauthorized to access information"})
			return
		}

		c.IndentedJSON(http.StatusOK, user)
	}
}
