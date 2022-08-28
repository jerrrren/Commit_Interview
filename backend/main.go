package main

import (
	"github.com/bojie/orbital/backend/auth"
	"github.com/bojie/orbital/backend/db"
	"github.com/bojie/orbital/backend/email"
	"github.com/bojie/orbital/backend/routerMiddleware"
	"github.com/bojie/orbital/backend/user"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {


	router := gin.Default()

	router.Use(routerMiddleware.CORSMiddleware())
	auth.AuthRoutes(router)
	user.UserRoutes(router)
	email.EmailRoutes(router)

	router.Run(":8080")

	defer db.DB.Close()
}
