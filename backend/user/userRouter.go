package user

import (
	"github.com/gin-gonic/gin"
	"github.com/bojie/orbital/backend/routerMiddleware"
	"github.com/bojie/orbital/backend/auth"
)

func UserRoutes(incomingRoutes *gin.Engine){
	incomingRoutes.GET("/users/:user_id",routerMiddleware.Authenticate(),GetUser())
	incomingRoutes.GET("/token",auth.GetAccessToken())

}				