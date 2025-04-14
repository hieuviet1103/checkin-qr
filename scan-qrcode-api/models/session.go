package models

import (
	"database/sql"
	"encoding/json"
	"time"
)

type Session struct {
	SessionID   int          `json:"session_id" db:"SessionID"`
	SessionName string       `json:"session_name" db:"SessionName"`
	StartTime   sql.NullTime `json:"-" db:"StartTime"`
	EndTime     sql.NullTime `json:"-" db:"EndTime"`
	CreatedAt   sql.NullTime `json:"-" db:"CreatedAt"`
	BaseUrl     string       `json:"base_url" db:"BaseUrl"`
}

// MarshalJSON implements custom JSON marshaling
func (s Session) MarshalJSON() ([]byte, error) {
	type Alias Session
	return json.Marshal(&struct {
		*Alias
		StartTime *time.Time `json:"start_time,omitempty"`
		EndTime   *time.Time `json:"end_time,omitempty"`
	}{
		Alias:     (*Alias)(&s),
		StartTime: s.getStartTime(),
		EndTime:   s.getEndTime(),
	})
}

func (s Session) getStartTime() *time.Time {
	if s.StartTime.Valid {
		return &s.StartTime.Time
	}
	return nil
}

func (s Session) getEndTime() *time.Time {
	if s.EndTime.Valid {
		return &s.EndTime.Time
	}
	return nil
}

type SessionRequest struct {
	SessionName string `json:"session_name" binding:"required"`
	StartTime   string `json:"start_time"`
	EndTime     string `json:"end_time"`
	BaseUrl     string `json:"base_url" binding:"required"`
}

type SessionResponse struct {
	SessionID   int    `json:"session_id"`
	SessionName string `json:"session_name"`
	StartTime   string `json:"start_time,omitempty"`
	EndTime     string `json:"end_time,omitempty"`
	CreatedAt   string `json:"created_at,omitempty"`
	BaseUrl     string `json:"base_url"`
}

// CreateSession tạo session mới
func CreateSession(req SessionRequest) (int, error) {
	query := `
		INSERT INTO Sessions (SessionName, BaseUrl)
		VALUES (?, ?);
		SELECT SCOPE_IDENTITY() as SessionID;
	`

	var sessionID int
	err := DB.QueryRow(query, req.SessionName, req.BaseUrl).Scan(&sessionID)
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
		SET SessionName = @p1, BaseUrl = @p2
		WHERE SessionID = @p3
	`

	_, err := DB.Exec(query, req.SessionName, req.BaseUrl, id)
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
