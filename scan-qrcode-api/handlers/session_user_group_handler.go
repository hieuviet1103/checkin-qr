package handlers

import (
	"net/http"
	"scan-qrcode-api/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

// AssignUserToSessionGroup gán user vào session và group
func AssignUserToSessionGroup(c *gin.Context) {
	var req models.SessionUserGroupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := models.AssignUserToSessionGroup(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User assigned to session group successfully"})
}

// GetUserSessionGroups lấy danh sách session và group của user
func GetUserSessionGroups(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("user_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	userSessionGroups, err := models.GetUserSessionGroups(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, userSessionGroups)
}

// UpdateUserSessionGroup cập nhật trạng thái user trong session và group
func UpdateUserSessionGroup(c *gin.Context) {
	var req models.SessionUserGroupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := models.UpdateUserSessionGroup(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User session group updated successfully"})
}

// RemoveUserFromSessionGroup xóa user khỏi session và group
func RemoveUserFromSessionGroup(c *gin.Context) {
	sessionID, err := strconv.Atoi(c.Param("session_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid session ID"})
		return
	}

	userID, err := strconv.Atoi(c.Param("user_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	groupID, err := strconv.Atoi(c.Param("group_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid group ID"})
		return
	}

	err = models.RemoveUserFromSessionGroup(sessionID, userID, groupID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User removed from session group successfully"})
}
