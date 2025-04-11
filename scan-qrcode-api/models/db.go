package models

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/denisenkom/go-mssqldb"
)

var DB *sql.DB

// InitializeDB khởi tạo kết nối đến SQL Server
func InitializeDB() error {
	// Lấy thông tin kết nối từ biến môi trường
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	// Nếu không có thông tin kết nối, dùng giá trị mặc định
	if dbHost == "" {
		dbHost = "localhost"
	}
	if dbPort == "" {
		dbPort = "1433"
	}
	if dbUser == "" {
		dbUser = "sa"
	}
	if dbPassword == "" {
		dbPassword = "YourPassword123"
	}
	if dbName == "" {
		dbName = "ScanQrDB"
	}

	// Chuỗi kết nối SQL Server
	connString := fmt.Sprintf("server=%s;user id=%s;password=%s;port=%s;database=%s;",
		dbHost, dbUser, dbPassword, dbPort, dbName)

	fmt.Println("Chuỗi kết nối SQL Server")
	fmt.Println(connString)

	// Mở kết nối database
	var err error
	DB, err = sql.Open("mssql", connString)
	if err != nil {
		return err
	}
	fmt.Println("Mở kết nối database")

	// Kiểm tra kết nối
	err = DB.Ping()
	if err != nil {
		return err
	}

	fmt.Println("Kết nối SQL Server thành công")
	log.Println("Kết nối SQL Server thành công")
	return nil
}

// CloseDB đóng kết nối database
func CloseDB() {
	if DB != nil {
		DB.Close()
		fmt.Println("đóng kết nối database")
	}
}
