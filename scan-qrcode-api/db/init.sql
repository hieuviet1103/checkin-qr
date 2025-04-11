-- Tạo database nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ScanQrDB')
BEGIN
    CREATE DATABASE [ScanQrDB]
    CONTAINMENT = NONE
    ON PRIMARY 
    (NAME = N'ScanQrDB', FILENAME = N'D:\Database\ScanQrDB.mdf', SIZE = 73728KB, MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB)
    LOG ON 
    (NAME = N'ScanQrDB_log', FILENAME = N'D:\Database\ScanQrDB_log.ldf', SIZE = 73728KB, MAXSIZE = 2048GB, FILEGROWTH = 65536KB)
    WITH CATALOG_COLLATION = DATABASE_DEFAULT;
END
GO

USE [ScanQrDB];
GO

-- Tạo bảng Users nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Users](
        [UserID] [int] IDENTITY(1,1) NOT NULL,
        [UserName] [nvarchar](100) NOT NULL,
        [Email] [nvarchar](255) NOT NULL,
        [PasswordHash] [nvarchar](255) NOT NULL,
        [Salt] [nvarchar](50) NULL,
        [CreatedAt] [datetime] NOT NULL DEFAULT (getdate()),
        [UpdatedAt] [datetime] NOT NULL DEFAULT (getdate()),
        [Role] [nvarchar](20) NOT NULL DEFAULT ('User'),
    PRIMARY KEY CLUSTERED 
    (
        [UserID] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    UNIQUE NONCLUSTERED 
    (
        [Email] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY];
END
GO

-- Tạo bảng Groups nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Groups]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Groups](
        [GroupID] [int] IDENTITY(1,1) NOT NULL,
        [GroupName] [nvarchar](100) NOT NULL,
    PRIMARY KEY CLUSTERED 
    (
        [GroupID] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY];
END
GO

-- Tạo bảng Sessions nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Sessions]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Sessions](
        [SessionID] [int] IDENTITY(1,1) NOT NULL,
        [SessionName] [nvarchar](100) NOT NULL,
        [StartTime] [datetime] NULL,
        [EndTime] [datetime] NULL,
        [CreatedAt] [datetime] NULL DEFAULT (getdate()),
        [BaseUrl] [nvarchar](500) NULL,
    PRIMARY KEY CLUSTERED 
    (
        [SessionID] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY];
END
GO

-- Tạo bảng Customers nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Customers]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Customers](
        [CustomerID] [int] IDENTITY(1,1) NOT NULL,
        [FullName] [nvarchar](100) NULL,
        [QRCode] [nvarchar](255) NOT NULL,
        [QrImage] [nvarchar](max) NULL,
        [SessionID] [int] NULL,
    PRIMARY KEY CLUSTERED 
    (
        [CustomerID] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    UNIQUE NONCLUSTERED 
    (
        [QRCode] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY];
END
GO

-- Tạo bảng CheckIns nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CheckIns]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[CheckIns](
        [CheckInID] [int] IDENTITY(1,1) NOT NULL,
        [CustomerID] [int] NOT NULL,
        [SessionID] [int] NOT NULL,
        [CheckedInAt] [datetime] NULL DEFAULT (getdate()),
        [CheckedInBy] [int] NULL,
    PRIMARY KEY CLUSTERED 
    (
        [CheckInID] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY];
END
GO

-- Tạo bảng SessionGroups nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SessionGroups]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[SessionGroups](
        [SessionID] [int] NOT NULL,
        [GroupID] [int] NOT NULL,
    PRIMARY KEY CLUSTERED 
    (
        [SessionID] ASC,
        [GroupID] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY];
END
GO

-- Tạo bảng SessionUserGroups nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SessionUserGroups]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[SessionUserGroups](
        [SessionID] [int] NOT NULL,
        [UserID] [int] NOT NULL,
        [GroupID] [int] NULL,
    PRIMARY KEY CLUSTERED 
    (
        [SessionID] ASC,
        [UserID] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY];
END
GO

-- Thêm các foreign key constraints
ALTER TABLE [dbo].[CheckIns] WITH CHECK ADD FOREIGN KEY([CheckedInBy]) REFERENCES [dbo].[Users] ([UserID]);
GO
ALTER TABLE [dbo].[CheckIns] WITH CHECK ADD FOREIGN KEY([CustomerID]) REFERENCES [dbo].[Customers] ([CustomerID]);
GO
ALTER TABLE [dbo].[CheckIns] WITH CHECK ADD FOREIGN KEY([SessionID]) REFERENCES [dbo].[Sessions] ([SessionID]);
GO
ALTER TABLE [dbo].[SessionGroups] WITH CHECK ADD FOREIGN KEY([GroupID]) REFERENCES [dbo].[Groups] ([GroupID]);
GO
ALTER TABLE [dbo].[SessionGroups] WITH CHECK ADD FOREIGN KEY([SessionID]) REFERENCES [dbo].[Sessions] ([SessionID]);
GO
ALTER TABLE [dbo].[SessionUserGroups] WITH CHECK ADD FOREIGN KEY([GroupID]) REFERENCES [dbo].[Groups] ([GroupID]);
GO
ALTER TABLE [dbo].[SessionUserGroups] WITH CHECK ADD FOREIGN KEY([SessionID]) REFERENCES [dbo].[Sessions] ([SessionID]);
GO
ALTER TABLE [dbo].[SessionUserGroups] WITH CHECK ADD FOREIGN KEY([UserID]) REFERENCES [dbo].[Users] ([UserID]);
GO

-- Tạo stored procedure sp_CheckInByQRCode nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_CheckInByQRCode]') AND type in (N'P', N'PC'))
BEGIN
    EXEC dbo.sp_executesql @statement = N'
    CREATE PROCEDURE [dbo].[sp_CheckInByQRCode]
      @UserId INT,
      @SessionId INT,
      @QrCode nvarchar(255),
      @CustomerId int OUTPUT
    AS
    BEGIN
      SET NOCOUNT ON;
      
      select @CustomerId = CustomerID from Customers where QRCode = TRIM(@QrCode)

      -- Thêm bản ghi check-in mới
      BEGIN TRY
        INSERT INTO CheckIns (CustomerID, SessionId, CheckedInBy, CheckedInAt)
        VALUES (@customerID, @SessionId, @UserId, GETDATE() );
        
      END TRY
      BEGIN CATCH
        SET @CustomerId = 0
      END CATCH
    END';
END
GO

-- Tạo stored procedure usp_CheckLogin nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_CheckLogin]') AND type in (N'P', N'PC'))
BEGIN
    EXEC dbo.sp_executesql @statement = N'
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
    DECLARE @ComputedHash VARBINARY(64) = HASHBYTES(''SHA2_256'', @PasswordSalted);
    DECLARE @ComputedHashHex NVARCHAR(256) = CONVERT(NVARCHAR(256), @ComputedHash, 1);

    IF @StoredHash = @ComputedHashHex
    SET @IsAuthenticated = 1;
    ELSE
    SET @IsAuthenticated = 0;
    END';
END
GO

-- Tạo stored procedure usp_CreateUser nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_CreateUser]') AND type in (N'P', N'PC'))
BEGIN
    EXEC dbo.sp_executesql @statement = N'
    CREATE PROCEDURE [dbo].[usp_CreateUser]
    @UserName NVARCHAR(100),
    @Email NVARCHAR(255),
    @Password NVARCHAR(255),
    @Salt NVARCHAR(50),
    @UserID INT OUTPUT
    AS
    BEGIN
    SET NOCOUNT ON;

    -- Tạo chuỗi để hash: password + salt
    DECLARE @PasswordSalted NVARCHAR(255) = @Password + @Salt;

    -- Hash password bằng SHA2_256
    DECLARE @PasswordHash VARBINARY(64) = HASHBYTES(''SHA2_256'', @PasswordSalted);

    -- Kiểm tra trùng email
    IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email)
    BEGIN
    RAISERROR(''Email này đã đăng ký'', 16, 1);
    RETURN;
    END

    -- Insert user
    INSERT INTO Users (UserName, Email, PasswordHash, Salt)
    VALUES (@UserName, @Email, CONVERT(NVARCHAR(256), @PasswordHash, 1), @Salt);

    SET @UserID = SCOPE_IDENTITY();
    END';
END
GO

-- Thêm dữ liệu mẫu
IF NOT EXISTS (SELECT TOP 1 * FROM [dbo].[Users])
BEGIN
    DECLARE @UserID INT;
    DECLARE @Salt NVARCHAR(50) = CONVERT(NVARCHAR(50), NEWID());
    DECLARE @PasswordSalted NVARCHAR(255) = 'password123' + @Salt;
    DECLARE @PasswordHash VARBINARY(64) = HASHBYTES('SHA2_256', @PasswordSalted);
    
    INSERT INTO [dbo].[Users] ([UserName], [Email], [PasswordHash], [Salt], [Role])
    VALUES 
        ('admin', 'admin@example.com', CONVERT(NVARCHAR(256), @PasswordHash, 1), @Salt, 'Admin'),
        ('user1', 'user1@example.com', CONVERT(NVARCHAR(256), @PasswordHash, 1), @Salt, 'User'),
        ('user2', 'user2@example.com', CONVERT(NVARCHAR(256), @PasswordHash, 1), @Salt, 'User');
END
GO

-- Thêm dữ liệu mẫu cho các nhóm
IF NOT EXISTS (SELECT TOP 1 * FROM [dbo].[Groups])
BEGIN
    INSERT INTO [dbo].[Groups] ([GroupName])
    VALUES 
        ('Administrators'),
        ('Regular Users'),
        ('Viewers');
END
GO 