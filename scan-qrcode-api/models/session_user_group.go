package models

import (
	"time"
)

type SessionUserGroup struct {
	SessionID int       `json:"session_id" db:"SessionID"`
	UserID    int       `json:"user_id" db:"UserID"`
	GroupID   int       `json:"group_id" db:"GroupID"`
	CreateAt  time.Time `json:"create_at" db:"CreateAt"`
	IsActive  bool      `json:"is_active" db:"IsActive"`
}

type SessionUserGroupRequest struct {
	SessionID int  `json:"session_id" binding:"required"`
	UserID    int  `json:"user_id" binding:"required"`
	GroupID   int  `json:"group_id" binding:"required"`
	IsActive  bool `json:"is_active"`
}

type SessionUserGroupResponse struct {
	SessionID int       `json:"session_id"`
	UserID    int       `json:"user_id"`
	GroupID   int       `json:"group_id"`
	CreateAt  time.Time `json:"create_at"`
	IsActive  bool      `json:"is_active"`
}

type UserSessionGroup struct {
	SessionUserGroup
	SessionName string `json:"session_name"`
	GroupName   string `json:"group_name"`
}

// AssignUserToSessionGroup gán user vào session và group
func AssignUserToSessionGroup(req SessionUserGroupRequest) error {
	query := `
		INSERT INTO SessionUserGroups (SessionID, UserID, GroupID, IsActive)
		VALUES (@p1, @p2, @p3, @p4)
	`

	_, err := DB.Exec(query, req.SessionID, req.UserID, req.GroupID, req.IsActive)
	return err
}

// GetUserSessionGroups lấy danh sách session và group của user
func GetUserSessionGroups(userID int) ([]UserSessionGroup, error) {
	query := `
		SELECT sug.SessionID, sug.UserID, sug.GroupID, sug.CreateAt, sug.IsActive,
			   s.SessionName, g.GroupName
		FROM SessionUserGroups sug
		JOIN Sessions s ON sug.SessionID = s.SessionID
		JOIN Groups g ON sug.GroupID = g.GroupID
		WHERE sug.UserID = @p1
		ORDER BY sug.CreateAt DESC
	`

	rows, err := DB.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var userSessionGroups []UserSessionGroup
	for rows.Next() {
		var usg UserSessionGroup
		err := rows.Scan(&usg.SessionID, &usg.UserID, &usg.GroupID, &usg.CreateAt, &usg.IsActive,
			&usg.SessionName, &usg.GroupName)
		if err != nil {
			return nil, err
		}
		userSessionGroups = append(userSessionGroups, usg)
	}

	return userSessionGroups, nil
}

// UpdateUserSessionGroup cập nhật trạng thái user trong session và group
func UpdateUserSessionGroup(req SessionUserGroupRequest) error {
	query := `
		UPDATE SessionUserGroups
		SET IsActive = @p1
		WHERE SessionID = @p2 AND UserID = @p3 AND GroupID = @p4
	`

	_, err := DB.Exec(query, req.IsActive, req.SessionID, req.UserID, req.GroupID)
	return err
}

// RemoveUserFromSessionGroup xóa user khỏi session và group
func RemoveUserFromSessionGroup(sessionID, userID, groupID int) error {
	query := `
		DELETE FROM SessionUserGroups
		WHERE SessionID = @p1 AND UserID = @p2 AND GroupID = @p3
	`

	_, err := DB.Exec(query, sessionID, userID, groupID)
	return err
}
