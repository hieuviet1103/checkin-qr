package handlers

import (
	"net/http"
	"scan-qrcode-api/models"

	"github.com/gin-gonic/gin"
)

type ProfileResponse struct {
	User models.User `json:"user"`
}

// GetProfile godoc
// @Summary Lấy thông tin profile người dùng
// @Description Lấy thông tin chi tiết của người dùng đã đăng nhập
// @Tags profile
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} ProfileResponse
// @Failure 401 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /profile [get]
func GetProfile(c *gin.Context) {
	// Lấy userID từ context (đã được thiết lập bởi AuthMiddleware)
	userIDInterface, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Người dùng chưa đăng nhập"})
		return
	}

	// Chuyển đổi userID thành string
	userIDStr := userIDInterface.(string)

	// Lấy thông tin người dùng từ database
	user, err := models.GetUserByID(userIDStr)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy thông tin người dùng"})
		return
	}

	// Không trả về thông tin mật khẩu và salt
	user.PasswordHash = ""
	user.Salt = ""

	// Trả về thông tin người dùng
	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}
