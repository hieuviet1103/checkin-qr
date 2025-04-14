package models

import (
	"database/sql"
	"time"
)

type Session struct {
	SessionID   int       `json:"session_id" db:"SessionID"`
	SessionName string    `json:"session_name" db:"SessionName"`
	StartTime   time.Time `json:"start_time" db:"StartTime"`
	EndTime     time.Time `json:"end_time" db:"EndTime"`
	CreatedAt   time.Time `json:"created_at" db:"CreatedAt"`
	BaseUrl     string    `json:"base_url" db:"BaseUrl"`
}

type SessionRequest struct {
	SessionName string    `json:"session_name" binding:"required"`
	StartTime   time.Time `json:"start_time"`
	EndTime     time.Time `json:"end_time"`
	BaseUrl     string    `json:"base_url"`
}

type SessionResponse struct {
	SessionID   int       `json:"session_id"`
	SessionName string    `json:"session_name"`
	StartTime   time.Time `json:"start_time"`
	EndTime     time.Time `json:"end_time"`
	CreatedAt   time.Time `json:"created_at"`
	BaseUrl     string    `json:"base_url"`
}

// CreateSession tạo session mới
func CreateSession(req SessionRequest) (int, error) {
	query := `
		INSERT INTO Sessions (SessionName, StartTime, EndTime, BaseUrl)
		VALUES (@p1, @p2, @p3, @p4)
		SELECT SCOPE_IDENTITY() as SessionID
	`

	var sessionID int
	err := DB.QueryRow(query, req.SessionName, req.StartTime, req.EndTime, req.BaseUrl).Scan(&sessionID)
	if err != nil {
		return 0, err
	}

	return sessionID, nil
}

// GetSessions lấy danh sách sessions
func GetSessions() ([]Session, error) {
	query := `
		SELECT SessionID, SessionName, StartTime, EndTime, CreatedAt, BaseUrl
		FROM Sessions
		ORDER BY CreatedAt DESC
	`

	rows, err := DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sessions []Session
	for rows.Next() {
		var s Session
		err := rows.Scan(&s.SessionID, &s.SessionName, &s.StartTime, &s.EndTime, &s.CreatedAt, &s.BaseUrl)
		if err != nil {
			return nil, err
		}
		sessions = append(sessions, s)
	}

	return sessions, nil
}

// GetSessionByID lấy thông tin session theo ID
func GetSessionByID(id int) (*Session, error) {
	query := `
		SELECT SessionID, SessionName, StartTime, EndTime, CreatedAt, BaseUrl
		FROM Sessions
		WHERE SessionID = @p1
	`

	var session Session
	err := DB.QueryRow(query, id).Scan(&session.SessionID, &session.SessionName, &session.StartTime, &session.EndTime, &session.CreatedAt, &session.BaseUrl)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &session, nil
}

// UpdateSession cập nhật thông tin session
func UpdateSession(id int, req SessionRequest) error {
	query := `
		UPDATE Sessions
		SET SessionName = @p1, StartTime = @p2, EndTime = @p3, BaseUrl = @p4
		WHERE SessionID = @p5
	`

	_, err := DB.Exec(query, req.SessionName, req.StartTime, req.EndTime, req.BaseUrl, id)
	return err
}

// DeleteSession xóa session
func DeleteSession(id int) error {
	query := `
		DELETE FROM Sessions
		WHERE SessionID = @p1
	`

	_, err := DB.Exec(query, id)
	return err
}
