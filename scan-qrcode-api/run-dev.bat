@echo off
echo === Chạy ứng dụng với hot reload ===

REM Kiểm tra xem đã cài đặt nodemon chưa
where nodemon >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Cài đặt nodemon...
    npm install -g nodemon
)

REM Chạy ứng dụng với nodemon (để hot reload)
nodemon --exec "go run main.go" --signal SIGTERM -e go

echo === Ứng dụng đã dừng === 