package models

import (
	"database/sql"
	"encoding/json"
	"time"
)

type Group struct {
	GroupID   int          `json:"group_id" db:"GroupID"`
	GroupName string       `json:"group_name" db:"GroupName"`
	CreatedAt sql.NullTime `json:"-" db:"CreatedAt"`
	IsDeleted sql.NullBool `json:"-" db:"IsDeleted"`
}

// MarshalJSON implements custom JSON marshaling
func (g Group) MarshalJSON() ([]byte, error) {
	type Alias Group
	return json.Marshal(&struct {
		*Alias
		CreatedAt *time.Time `json:"created_at,omitempty"`
	}{
		Alias:     (*Alias)(&g),
		CreatedAt: g.getCreatedAt(),
	})
}

func (g Group) getCreatedAt() *time.Time {
	if g.CreatedAt.Valid {
		return &g.CreatedAt.Time
	}
	return nil
}

type GroupRequest struct {
	GroupName string `json:"group_name" binding:"required"`
}

type GroupResponse struct {
	GroupID   int    `json:"group_id" db:"GroupID"`
	GroupName string `json:"group_name" db:"GroupName"`
	CreatedAt string `json:"created_at,omitempty" db:"CreatedAt"`
}

// CreateGroup tạo group mới
func CreateGroup(req GroupRequest) (int, error) {
	query := `
		INSERT INTO Groups (GroupName, IsDeleted)
		VALUES (?, 0);
		SELECT SCOPE_IDENTITY() as GroupID;
	`

	var groupID int
	err := DB.QueryRow(query, req.GroupName).Scan(&groupID)
	if err != nil {
		return 0, err
	}

	return groupID, nil
}

// GetGroups lấy danh sách groups
func GetGroups() ([]Group, error) {
	query := `
		SELECT GroupID, GroupName, CreatedAt
		FROM Groups
		WHERE ISNULL(IsDeleted, 0) = 0
		ORDER BY CreatedAt DESC
	`

	rows, err := DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groups []Group
	for rows.Next() {
		var g Group
		err := rows.Scan(&g.GroupID, &g.GroupName, &g.CreatedAt)
		if err != nil {
			return nil, err
		}
		groups = append(groups, g)
	}

	return groups, nil
}

// GetGroupByID lấy thông tin group theo ID
func GetGroupByID(id int) (*Group, error) {
	query := `
		SELECT GroupID, GroupName, CreatedAt
		FROM Groups
		WHERE GroupID = ? AND ISNULL(IsDeleted, 0) = 0
	`

	var group Group
	err := DB.QueryRow(query, id).Scan(&group.GroupID, &group.GroupName, &group.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &group, nil
}

// UpdateGroup cập nhật thông tin group
func UpdateGroup(id int, req GroupRequest) error {
	query := `
		UPDATE Groups
		SET GroupName = ?
		WHERE GroupID = ?
	`

	_, err := DB.Exec(query, req.GroupName, id)
	return err
}

// DeleteGroup xóa group
func DeleteGroup(id int) error {
	query := `
		UPDATE Groups
		SET IsDeleted = 1
		WHERE GroupID = ?
	`

	_, err := DB.Exec(query, id)
	return err
}
