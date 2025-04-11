package middlewares

import (
	"errors"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Lấy Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Yêu cầu đăng nhập để sử dụng tính năng này"})
			return
		}

		// Kiểm tra xem Authorization header có phải là Bearer token không
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token không đúng định dạng"})
			return
		}

		// Phân tích và xác thực token
		token, err := validateToken(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		// Lấy claims từ token
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token không hợp lệ"})
			return
		}

		// Lưu userID vào context để các handler sử dụng sau này
		c.Set("userID", claims["sub"])
		c.Next()
	}
}

func validateToken(tokenString string) (*jwt.Token, error) {
	// Lấy JWT secret key từ biến môi trường
	secretKey := os.Getenv("JWT_SECRET_KEY")
	if secretKey == "" {
		return nil, errors.New("Cấu hình JWT secret key chưa được thiết lập")
	}

	// Phân tích và xác thực token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Xác thực phương thức ký
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("Phương thức ký không hợp lệ")
		}
		return []byte(secretKey), nil
	})

	if err != nil {
		return nil, errors.New("Token không hợp lệ: " + err.Error())
	}

	return token, nil
}
