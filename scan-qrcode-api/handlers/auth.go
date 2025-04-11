package handlers

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"fmt"
	"net/http"
	"os"
	"scan-qrcode-api/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string      `json:"token"`
	User  models.User `json:"user"`
}

// Login godoc
// @Summary Đăng nhập vào hệ thống
// @Description Đăng nhập với email và password
// @Tags auth
// @Accept json
// @Produce json
// @Param request body LoginRequest true "Login credentials"
// @Success 200 {object} LoginResponse
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /login [post]
func Login(c *gin.Context) {

	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Thông tin đăng nhập không hợp lệ"})
		return
	}

	passwordSalted := req.Password + "123456"
	hashBytes := sha256.Sum256([]byte(passwordSalted))
	hashString := hex.EncodeToString(hashBytes[:])

	fmt.Println("hash for user: ", req.Email, hashString)
	// Tìm người dùng theo email
	user, err := models.GetUserByEmail(req.Email)
	fmt.Println("get user info ", user, err)
	//fmt.Println("user", user.Username)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Email hoặc mật khẩu không đúng"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi tìm kiếm người dùng"})
		return
	}

	// Kiểm tra mật khẩu
	//passwordSalted := req.Password + user.Salt
	//hashBytes := sha256.Sum256([]byte(passwordSalted))
	//hashString := hex.EncodeToString(hashBytes[:])

	fmt.Println("hash for user: ", req.Email, hashString)
	if hashString != user.PasswordHash {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email hoặc mật khẩu không đúng"})
		return
	}

	// Tạo token JWT
	token, err := generateJWT(fmt.Sprint(user.ID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi tạo token đăng nhập"})
		return
	}

	// Không trả về mật khẩu và salt
	user.PasswordHash = ""
	user.Salt = ""

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user":  user,
	})
}

func generateJWT(userID string) (string, error) {
	// Lấy secret key từ biến môi trường
	secretKey := os.Getenv("JWT_SECRET_KEY")
	if secretKey == "" {
		secretKey = "default_secret_key_for_development" // Fallback cho môi trường phát triển
	}

	// Tạo claims
	claims := jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(time.Hour * 24).Unix(), // 24 hours
		"iat": time.Now().Unix(),
	}

	// Tạo token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Ký token
	return token.SignedString([]byte(secretKey))
}
