package handlers

import (
	"net/http"
	"scan-qrcode-api/models"

	"github.com/gin-gonic/gin"
)

// UsersResponse là response trả về cho API lấy danh sách users
type UsersResponse struct {
	Users []models.User `json:"users"`
}

// GetUsers godoc
// @Summary Lấy danh sách tất cả người dùng
// @Description Lấy danh sách tất cả người dùng từ database
// @Tags users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} UsersResponse
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /users [get]
func GetUsers(c *gin.Context) {
	// Lấy danh sách users từ database
	users, err := models.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi lấy danh sách người dùng: " + err.Error()})
		return
	}

	// Trả về kết quả
	c.JSON(http.StatusOK, gin.H{
		"users": users,
	})
}

// UserResponse là response trả về cho API lấy chi tiết user
type UserResponse struct {
	User models.User `json:"user"`
}

// GetUserByID godoc
// @Summary Lấy thông tin chi tiết của một người dùng
// @Description Lấy thông tin chi tiết của một người dùng theo ID
// @Tags users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "User ID"
// @Success 200 {object} UserResponse
// @Failure 401 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /users/{id} [get]
func GetUserByID(c *gin.Context) {
	// Lấy user id từ path parameter
	userID := c.Param("id")

	// Lấy thông tin user từ database
	user, err := models.GetUserByID(userID)
	if err != nil {
		if err.Error() == "không tìm thấy người dùng" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy người dùng"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi lấy thông tin người dùng: " + err.Error()})
		}
		return
	}

	// Trả về kết quả
	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}
