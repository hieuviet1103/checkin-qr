USE [CheckinDB]
GO
/****** Object:  StoredProcedure [dbo].[usp_CreateUser]    Script Date: 14/04/2025 10:58:20 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[usp_CreateUser]
@UserName NVARCHAR(100),
@Email NVARCHAR(255),
@Password NVARCHAR(255),
@Salt NVARCHAR(50), -- Để tăng tính an toàn
@UserID INT OUTPUT
AS
BEGIN
SET NOCOUNT ON;

-- Tạo chuỗi để hash: password + salt
DECLARE @PasswordSalted NVARCHAR(255) = @Password + @Salt;

-- Hash password bằng SHA2_256
DECLARE @PasswordHash VARBINARY(64) = HASHBYTES('SHA2_256', @PasswordSalted);

-- Kiểm tra trùng email
IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email)
BEGIN
RAISERROR('Email này đã đăng ký', 16, 1);
RETURN;
END

-- Insert user
INSERT INTO Users (UserName, Email, PasswordHash, Salt)
VALUES (@UserName, @Email, CONVERT(NVARCHAR(256), @PasswordHash, 1), @Salt);

SET @UserID = SCOPE_IDENTITY();
END
GO
