package main

import (
	"log"
	"os"
	"your-backend-module/routes/api/aa"
	"your-backend-module/routes/api/aaiu"
	"your-backend-module/routes/api/admin"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func main() {
	// Initialize Gin router
	router := gin.Default()

	// CORS configuration for frontend
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://*.vercel.app", "https://auditarmor.com"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           86400,
	}))

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
			"service": "audit-armor",
		})
	})

	// Register route handlers
	aaiu.RegisterPulseRoutes(router)
	aa.RegisterAuthorizeRoutes(router)
	admin.RegisterAdminRoutes(router)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting Audit Armor backend on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
