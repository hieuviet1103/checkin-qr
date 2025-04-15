package models

import (
	"database/sql"
	"encoding/json"
	"time"
)

type Group struct {
	GroupID   int             `json:"group_id" db:"GroupID"`
	GroupName string          `json:"group_name" db:"GroupName"`
	Latitude  sql.NullFloat64 `json:"-" db:"Latitude"`
	Longitude sql.NullFloat64 `json:"-" db:"Longitude"`
	CreatedAt sql.NullTime    `json:"-" db:"CreatedAt"`
	IsDeleted sql.NullBool    `json:"-" db:"IsDeleted"`
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
	GroupName string  `json:"group_name" binding:"required"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type GroupResponse struct {
	GroupID   int     `json:"group_id" db:"GroupID"`
	GroupName string  `json:"group_name" db:"GroupName"`
	Latitude  float64 `json:"latitude,omitempty" db:"Latitude"`
	Longitude float64 `json:"longitude,omitempty" db:"Longitude"`
	CreatedAt string  `json:"created_at,omitempty" db:"CreatedAt"`
}

// CreateGroup tạo group mới
func CreateGroup(req GroupRequest) (int, error) {
	query := `
		INSERT INTO Groups (GroupName, Latitude, Longitude, IsDeleted)
		VALUES (?, ?, ?, 0);
		SELECT SCOPE_IDENTITY() as GroupID;
	`

	var groupID int
	err := DB.QueryRow(query, req.GroupName, req.Latitude, req.Longitude).Scan(&groupID)
	if err != nil {
		return 0, err
	}

	return groupID, nil
}

// GetGroups lấy danh sách groups
func GetGroups() ([]Group, error) {
	query := `
		SELECT GroupID, GroupName, Latitude, Longitude, CreatedAt
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
		err := rows.Scan(&g.GroupID, &g.GroupName, &g.Latitude, &g.Longitude, &g.CreatedAt)
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
		SELECT GroupID, GroupName, Latitude, Longitude, CreatedAt
		FROM Groups
		WHERE GroupID = ? AND ISNULL(IsDeleted, 0) = 0
	`

	var group Group
	err := DB.QueryRow(query, id).Scan(&group.GroupID, &group.GroupName, &group.Latitude, &group.Longitude, &group.CreatedAt)
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
		SET GroupName = ?, Latitude = ?, Longitude = ?
		WHERE GroupID = ?
	`

	_, err := DB.Exec(query, req.GroupName, req.Latitude, req.Longitude, id)
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
