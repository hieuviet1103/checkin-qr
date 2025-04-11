package main

import (
	"log"
	"os"

	"scan-qrcode-api/handlers"
	"scan-qrcode-api/middlewares"
	"scan-qrcode-api/models"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "scan-qrcode-api/docs" // Thêm dòng này để import docs
)

// @title           Scan QR Code API
// @version         1.0
// @description     API cho ứng dụng quét mã QR.
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.swagger.io/support
// @contact.email  support@swagger.io

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @host      localhost:8080
// @BasePath  /api

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.
func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found")
	}

	// Khởi tạo kết nối database
	if err := models.InitializeDB(); err != nil {
		log.Fatalf("Không thể kết nối đến database: %v", err)
	}
	defer models.CloseDB()

	// Set port, default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Set up router
	router := gin.Default()

	// Routes
	router.POST("/api/login", handlers.Login)

	// Swagger route
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Protected routes
	authRoutes := router.Group("/api")
	authRoutes.Use(middlewares.AuthMiddleware())
	{
		authRoutes.GET("/profile", handlers.GetProfile)

		// User routes
		authRoutes.GET("/users", handlers.GetUsers)
		authRoutes.GET("/users/:id", handlers.GetUserByID)
	}

	// Start server
	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
