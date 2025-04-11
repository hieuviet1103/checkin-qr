package models

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"
)

// User là struct đại diện cho người dùng
type User struct {
	ID           int       `json:"id"`
	Username     string    `json:"username"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"` // Không hiển thị mật khẩu trong JSON
	Salt         string    `json:"-"` // Không hiển thị salt trong JSON
	Role         string    `json:"role"`
	Roles        []string  `json:"roles"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
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

	return &user, nil
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

	return &user, nil
}
