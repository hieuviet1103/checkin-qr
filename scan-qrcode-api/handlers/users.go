package handlers

import (
	"net/http"
	"scan-qrcode-api/models"
	"strconv"

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

// CreateUserRequest là request body cho API tạo user
type CreateUserRequest struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// CreateUser godoc
// @Summary Tạo người dùng mới
// @Description Tạo một người dùng mới với thông tin được cung cấp
// @Tags users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param user body CreateUserRequest true "Thông tin người dùng"
// @Success 201 {object} UserResponse
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /users [post]
func CreateUser(c *gin.Context) {
	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ: " + err.Error()})
		return
	}

	user, err := models.CreateUser(req.Username, req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi tạo người dùng: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"user": user,
	})
}

// UpdateUserRequest là request body cho API cập nhật user
type UpdateUserRequest struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
}

// UpdateUser godoc
// @Summary Cập nhật thông tin người dùng
// @Description Cập nhật thông tin của một người dùng theo ID
// @Tags users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "User ID"
// @Param user body UpdateUserRequest true "Thông tin cập nhật"
// @Success 200 {object} UserResponse
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /users/{id} [put]
func UpdateUser(c *gin.Context) {
	userID := c.Param("id")
	id, err := strconv.Atoi(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	var req UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ: " + err.Error()})
		return
	}

	err = models.UpdateUser(id, req.Username, req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi cập nhật người dùng: " + err.Error()})
		return
	}

	user, err := models.GetUserByID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi lấy thông tin người dùng: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

// UpdateUserRoleRequest là request body cho API cập nhật role
type UpdateUserRoleRequest struct {
	Role string `json:"role" binding:"required"`
}

// UpdateUserRole godoc
// @Summary Cập nhật role của người dùng
// @Description Cập nhật role của một người dùng theo ID
// @Tags users
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path string true "User ID"
// @Param role body UpdateUserRoleRequest true "Role mới"
// @Success 200 {object} UserResponse
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /users/{id}/role [put]
func UpdateUserRole(c *gin.Context) {
	userID := c.Param("id")
	id, err := strconv.Atoi(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID không hợp lệ"})
		return
	}

	var req UpdateUserRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dữ liệu không hợp lệ: " + err.Error()})
		return
	}

	err = models.UpdateUserRole(id, req.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi cập nhật role: " + err.Error()})
		return
	}

	user, err := models.GetUserByID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi lấy thông tin người dùng: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}
