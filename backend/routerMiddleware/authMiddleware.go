package routerMiddleware

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/bojie/orbital/backend/auth"
)

func Authenticate() gin.HandlerFunc {
	return func(c *gin.Context) {
		clientToken := c.GetHeader("token")
		
		claims, err1 := auth.ValidateToken(clientToken)
		if err1 != "" {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Token is either invalid or expired"})
			c.Abort()
			return
		}
		c.Set("token",clientToken)
		c.Set("name", claims.Name)
	}
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With,token")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT,PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
