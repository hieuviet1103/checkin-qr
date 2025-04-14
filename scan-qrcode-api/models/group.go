package models

import (
	"database/sql"
)

type Group struct {
	GroupID   int    `json:"group_id" db:"GroupID"`
	GroupName string `json:"group_name" db:"GroupName"`
}

type GroupRequest struct {
	GroupName string `json:"group_name" binding:"required"`
}

type GroupResponse struct {
	GroupID   int    `json:"group_id"`
	GroupName string `json:"group_name"`
}

// CreateGroup tạo group mới
func CreateGroup(req GroupRequest) (int, error) {
	query := `
		INSERT INTO Groups (GroupName)
		VALUES (@p1)
		SELECT SCOPE_IDENTITY() as GroupID
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
		SELECT GroupID, GroupName
		FROM Groups
		ORDER BY GroupName
	`

	rows, err := DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groups []Group
	for rows.Next() {
		var g Group
		err := rows.Scan(&g.GroupID, &g.GroupName)
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
		SELECT GroupID, GroupName
		FROM Groups
		WHERE GroupID = @p1
	`

	var group Group
	err := DB.QueryRow(query, id).Scan(&group.GroupID, &group.GroupName)
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
		SET GroupName = @p1
		WHERE GroupID = @p2
	`

	_, err := DB.Exec(query, req.GroupName, id)
	return err
}

// DeleteGroup xóa group
func DeleteGroup(id int) error {
	query := `
		DELETE FROM Groups
		WHERE GroupID = @p1
	`

	_, err := DB.Exec(query, id)
	return err
}
