package models

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"math/rand"
	"strings"
	"time"
)

// User là struct đại diện cho người dùng
type User struct {
	ID           int           `json:"id"`
	Username     string        `json:"username"`
	Email        string        `json:"email"`
	PasswordHash string        `json:"-"` // Không hiển thị mật khẩu trong JSON
	Salt         string        `json:"-"` // Không hiển thị salt trong JSON
	Role         string        `json:"role"`
	Roles        []string      `json:"roles"`
	CreatedAt    time.Time     `json:"created_at"`
	UpdatedAt    time.Time     `json:"updated_at"`
	Sessions     []UserSession `json:"sessions"`
}

type UserSession struct {
	UserID      int       `json:"user_id"`
	SessionID   int       `json:"session_id"`
	SessionName string    `json:"session_name"`
	BaseUrl     string    `json:"base_url"`
	StartTime   time.Time `json:"start_time"`
	EndTime     time.Time `json:"end_time"`
}

// GetAllUsers lấy danh sách tất cả người dùng từ database
func GetAllUsers() ([]User, error) {
	// Context với timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Query lấy tất cả users
	rows, err := DB.QueryContext(ctx, `
		SELECT UserID, UserName, Email, Role, Roles, CreatedAt, UpdatedAt 
		FROM Users 
		ORDER BY CreatedAt DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		var role sql.NullString
		var roles sql.NullString
		var createdAt, updatedAt sql.NullTime

		// Quét dữ liệu
		err := rows.Scan(
			&user.ID,
			&user.Username,
			&user.Email,
			&role,
			&roles,
			&createdAt,
			&updatedAt,
		)
		if err != nil {
			return nil, err
		}

		// Xử lý Role NULL
		if role.Valid {
			user.Role = role.String
		} else {
			user.Role = "User" // Giá trị mặc định
		}

		if roles.Valid {
			user.Roles = strings.Split(roles.String, ",")
			// err := json.Unmarshal([]byte(roles.String), &user.Roles) //strings.Split(roles.String, ",")
			// if err != nil {
			// 	fmt.Println("Lỗi khi chuyển đổi JSON sang struct: %v", err)
			// }

		} else {
			user.Roles = append(user.Roles, "scan")
		}

		// Xử lý dữ liệu thời gian
		if createdAt.Valid {
			user.CreatedAt = createdAt.Time
		} else {
			user.CreatedAt = time.Now()
		}

		if updatedAt.Valid {
			user.UpdatedAt = updatedAt.Time
		} else {
			user.UpdatedAt = time.Now()
		}

		users = append(users, user)
	}

	// Kiểm tra lỗi sau khi quét
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

// GetUserByID lấy thông tin người dùng theo ID
func GetUserByID(id string) (*User, error) {
	// Context với timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Query lấy user theo ID - dùng ? thay vì @ID
	query := `
		SELECT UserID, UserName, Email, Role, CreatedAt, UpdatedAt
		FROM Users 
		WHERE UserID = ?
	`

	var user User
	var createdAt, updatedAt sql.NullTime
	var role sql.NullString

	// Thực hiện query trực tiếp với tham số
	err := DB.QueryRowContext(ctx, query, id).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&role,
		&createdAt,
		&updatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("không tìm thấy người dùng")
		}
		return nil, err
	}

	// Xử lý Role NULL
	if role.Valid {
		user.Role = role.String
	} else {
		user.Role = "User" // Giá trị mặc định
	}

	// Xử lý dữ liệu thời gian
	if createdAt.Valid {
		user.CreatedAt = createdAt.Time
	} else {
		user.CreatedAt = time.Now()
	}

	if updatedAt.Valid {
		user.UpdatedAt = updatedAt.Time
	} else {
		user.UpdatedAt = time.Now()
	}

	user.Sessions, err = GetUserSessionsByID(id)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// GetUserSessionByID lấy danh sách thông tin session người dùng theo ID
func GetUserSessionsByID(id string) ([]UserSession, error) {
	// Context với timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	query := `
	  select g.UserID, s.SessionID, s.SessionName, s.BaseUrl, s.StartTime, s.EndTime from SessionUserGroups g
  		inner join Sessions s on s.SessionID = g.SessionID
  		where g.UserID = ?
	`
	var userSessions []UserSession

	rows, err := DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var userSession UserSession
		err := rows.Scan(
			&userSession.UserID,
			&userSession.SessionID,
			&userSession.SessionName,
			&userSession.BaseUrl,
			&userSession.StartTime,
			&userSession.EndTime,
		)
		if err != nil {
			return nil, err
		}
		userSessions = append(userSessions, userSession)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return userSessions, nil
}

// GetUserByEmail lấy thông tin người dùng theo email
func GetUserByEmail(email string) (*User, error) {
	// Context với timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Query lấy user theo email - sử dụng tham số dạng ?
	query := `
		SELECT UserID, UserName, Email, PasswordHash, Salt, Role, Roles, CreatedAt, UpdatedAt
		FROM Users 
		WHERE Email = ?
	`

	var user User
	var createdAt, updatedAt sql.NullTime
	var role sql.NullString  // Dùng NullString để xử lý NULL
	var roles sql.NullString // Dùng NullString để xử lý NULL
	var salt sql.NullString  // Dùng NullString cho Salt vì có thể là NULL

	fmt.Println("get user by email ", email)

	// Thực hiện query trực tiếp với tham số thay vì Named
	err := DB.QueryRowContext(ctx, query, email).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.PasswordHash,
		&salt,
		&role,
		&roles,
		&createdAt,
		&updatedAt,
	)

	if err != nil {
		fmt.Println("query error:", err.Error())
		if err == sql.ErrNoRows {
			return nil, errors.New("không tìm thấy người dùng")
		}
		return nil, err
	}

	// Xử lý dữ liệu NULL
	if salt.Valid {
		user.Salt = salt.String
	}

	// Xử lý Role NULL
	if role.Valid {
		user.Role = role.String
	} else {
		user.Role = "User" // Giá trị mặc định
	}

	if roles.Valid {
		user.Roles = strings.Split(roles.String, ",")
		// err := json.Unmarshal([]byte(roles.String), &user.Roles) //strings.Split(roles.String, ",")
		// if err != nil {
		// 	fmt.Println("Lỗi khi chuyển đổi JSON sang struct: %v", err)
		// }

	} else {
		user.Roles = append(user.Roles, "scan")
	}
	// Xử lý dữ liệu thời gian
	if createdAt.Valid {
		user.CreatedAt = createdAt.Time
	} else {
		user.CreatedAt = time.Now()
	}

	if updatedAt.Valid {
		user.UpdatedAt = updatedAt.Time
	} else {
		user.UpdatedAt = time.Now()
	}

	user.Sessions, err = GetUserSessionsByID(fmt.Sprint(user.ID))
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// CreateUser tạo người dùng mới
func CreateUser(username, email, password string) (*User, error) {
	// Context với timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Tạo salt ngẫu nhiên
	salt := generateRandomString(16)

	// Gọi stored procedure để tạo user
	var userID int
	_, err := DB.ExecContext(ctx, "EXEC usp_CreateUser @UserName = ?, @Email = ?, @Password = ?, @Salt = ?, @UserID = ? OUTPUT",
		username, email, password, salt, &userID)
	if err != nil {
		return nil, err
	}

	// Lấy thông tin user vừa tạo
	user, err := GetUserByID(fmt.Sprint(userID))
	if err != nil {
		return nil, err
	}

	return user, nil
}

// UpdateUser cập nhật thông tin người dùng
func UpdateUser(userID int, username, email string) error {
	// Context với timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Query cập nhật thông tin user
	query := `
		UPDATE Users 
		SET UserName = ?, Email = ?, UpdatedAt = GETDATE()
		WHERE UserID = ?
	`

	_, err := DB.ExecContext(ctx, query, username, email, userID)
	if err != nil {
		return err
	}

	return nil
}

// UpdateUserRole cập nhật role của người dùng
func UpdateUserRole(userID int, role string) error {
	// Context với timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Query cập nhật role
	query := `
		UPDATE Users 
		SET Role = ?, UpdatedAt = GETDATE()
		WHERE UserID = ?
	`

	_, err := DB.ExecContext(ctx, query, role, userID)
	if err != nil {
		return err
	}

	return nil
}

// Hàm helper tạo chuỗi ngẫu nhiên
func generateRandomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	result := make([]byte, length)
	for i := range result {
		result[i] = charset[rand.Intn(len(charset))]
	}
	return string(result)
}
