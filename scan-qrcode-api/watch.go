//go:build ignore
// +build ignore

package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

var (
	cmd          *exec.Cmd
	lastModified time.Time
)

func main() {
	fmt.Println("=== Chạy ứng dụng với hot reload ===")
	fmt.Println("Nhấn Ctrl+C để thoát")

	// Tạo thư mục tmp nếu chưa tồn tại
	if _, err := os.Stat("tmp"); os.IsNotExist(err) {
		os.Mkdir("tmp", 0755)
	}

	// Chạy ứng dụng lần đầu
	startApp()

	// Vòng lặp kiểm tra thay đổi
	for {
		time.Sleep(1 * time.Second)

		// Kiểm tra các thay đổi trong các file .go
		changed := false

		err := filepath.Walk(".", func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}

			// Bỏ qua các thư mục tmp và .git
			if info.IsDir() && (info.Name() == "tmp" || info.Name() == ".git") {
				return filepath.SkipDir
			}

			// Chỉ kiểm tra các file .go
			if !info.IsDir() && strings.HasSuffix(info.Name(), ".go") {
				if info.ModTime().After(lastModified) {
					changed = true
				}
			}

			return nil
		})

		if err != nil {
			log.Printf("Lỗi khi kiểm tra thay đổi: %v", err)
			continue
		}

		if changed {
			fmt.Println("\n=== Phát hiện thay đổi, khởi động lại ứng dụng ===")

			// Dừng ứng dụng hiện tại
			stopApp()

			// Khởi động lại ứng dụng
			startApp()

			// Cập nhật thời gian cuối cùng
			lastModified = time.Now()
		}
	}
}

func startApp() {
	// Biên dịch và chạy ứng dụng
	cmd = exec.Command("go", "run", "main.go")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	err := cmd.Start()
	if err != nil {
		log.Fatalf("Lỗi khi khởi động ứng dụng: %v", err)
	}

	// Cập nhật thời gian biên dịch
	lastModified = time.Now()

	fmt.Println("Ứng dụng đang chạy...")
}

func stopApp() {
	if cmd != nil && cmd.Process != nil {
		// Kill process
		if err := cmd.Process.Kill(); err != nil {
			log.Printf("Lỗi khi dừng ứng dụng: %v", err)
		}
		cmd.Wait()
	}
}
