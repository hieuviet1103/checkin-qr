USE [CheckinDB]
GO
/****** Object:  StoredProcedure [dbo].[usp_CheckLogin]    Script Date: 14/04/2025 10:58:20 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[usp_CheckLogin]
@Email NVARCHAR(255),
@Password NVARCHAR(255),
@IsAuthenticated BIT OUTPUT,
@UserID INT OUTPUT
AS
BEGIN
SET NOCOUNT ON;

DECLARE @StoredHash NVARCHAR(256);
DECLARE @StoredSalt NVARCHAR(50);

SELECT
@StoredHash = PasswordHash,
@StoredSalt = Salt,
@UserID = UserID
FROM Users
WHERE Email = @Email;

IF @StoredHash IS NULL
BEGIN
SET @IsAuthenticated = 0;
RETURN;
END

DECLARE @PasswordSalted NVARCHAR(255) = @Password + @StoredSalt;
DECLARE @ComputedHash VARBINARY(64) = HASHBYTES('SHA2_256', @PasswordSalted);
DECLARE @ComputedHashHex NVARCHAR(256) = CONVERT(NVARCHAR(256), @ComputedHash, 1);

IF @StoredHash = @ComputedHashHex
SET @IsAuthenticated = 1;
ELSE
SET @IsAuthenticated = 0;
END
GO
