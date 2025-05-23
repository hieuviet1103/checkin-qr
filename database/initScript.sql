USE [master]
GO
/****** Object:  Database [CheckinDB]    Script Date: 14/04/2025 10:56:07 SA ******/
CREATE DATABASE [CheckinDB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'CheckinDB', FILENAME = N'D:\Database\CheckinDB.mdf' , SIZE = 73728KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'CheckinDB_log', FILENAME = N'D:\Database\CheckinDB_log.ldf' , SIZE = 73728KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [CheckinDB] SET COMPATIBILITY_LEVEL = 130
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [CheckinDB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [CheckinDB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [CheckinDB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [CheckinDB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [CheckinDB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [CheckinDB] SET ARITHABORT OFF 
GO
ALTER DATABASE [CheckinDB] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [CheckinDB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [CheckinDB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [CheckinDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [CheckinDB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [CheckinDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [CheckinDB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [CheckinDB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [CheckinDB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [CheckinDB] SET  DISABLE_BROKER 
GO
ALTER DATABASE [CheckinDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [CheckinDB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [CheckinDB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [CheckinDB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [CheckinDB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [CheckinDB] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [CheckinDB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [CheckinDB] SET RECOVERY FULL 
GO
ALTER DATABASE [CheckinDB] SET  MULTI_USER 
GO
ALTER DATABASE [CheckinDB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [CheckinDB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [CheckinDB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [CheckinDB] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [CheckinDB] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [CheckinDB] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'CheckinDB', N'ON'
GO
ALTER DATABASE [CheckinDB] SET QUERY_STORE = OFF
GO
USE [CheckinDB]
GO
/****** Object:  User [checkindb]    Script Date: 14/04/2025 10:56:08 SA ******/
CREATE USER [checkindb] FOR LOGIN [checkindb] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [checkindb]
GO
ALTER ROLE [db_datareader] ADD MEMBER [checkindb]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [checkindb]
GO
/****** Object:  Table [dbo].[CheckIns]    Script Date: 14/04/2025 10:56:08 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CheckIns](
	[CheckInID] [int] IDENTITY(1,1) NOT NULL,
	[CustomerID] [int] NOT NULL,
	[SessionID] [int] NOT NULL,
	[CheckedInAt] [datetime] NULL,
	[CheckedInBy] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[CheckInID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Customers]    Script Date: 14/04/2025 10:56:08 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Groups]    Script Date: 14/04/2025 10:56:08 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Groups](
	[GroupID] [int] IDENTITY(1,1) NOT NULL,
	[GroupName] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[GroupID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SessionGroups]    Script Date: 14/04/2025 10:56:08 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SessionGroups](
	[SessionID] [int] NOT NULL,
	[GroupID] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[SessionID] ASC,
	[GroupID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Sessions]    Script Date: 14/04/2025 10:56:08 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Sessions](
	[SessionID] [int] IDENTITY(1,1) NOT NULL,
	[SessionName] [nvarchar](100) NOT NULL,
	[StartTime] [datetime] NULL,
	[EndTime] [datetime] NULL,
	[CreatedAt] [datetime] NULL,
	[BaseUrl] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[SessionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SessionUserGroups]    Script Date: 14/04/2025 10:56:08 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SessionUserGroups](
	[SessionID] [int] NOT NULL,
	[UserID] [int] NOT NULL,
	[GroupID] [int] NOT NULL,
	[CreateAt] [datetime] NULL,
	[IsActive] [bit] NULL,
 CONSTRAINT [PK__SessionU__188C1EBA443762AF] PRIMARY KEY CLUSTERED 
(
	[SessionID] ASC,
	[UserID] ASC,
	[GroupID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 14/04/2025 10:56:08 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserID] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](255) NOT NULL,
	[PasswordHash] [nvarchar](255) NOT NULL,
	[Salt] [nvarchar](50) NULL,
	[Roles] [nvarchar](500) NULL,
	[Role] [nvarchar](50) NULL,
	[CreatedAt] [datetime] NULL,
	[UpdatedAt] [datetime] NULL,
	[FullName] [nvarchar](500) NULL,
	[Gender] [int] NULL,
	[Dob] [datetime] NULL,
	[Passport] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[CheckIns] ADD  DEFAULT (getdate()) FOR [CheckedInAt]
GO
ALTER TABLE [dbo].[Sessions] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[CheckIns]  WITH CHECK ADD FOREIGN KEY([CheckedInBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[CheckIns]  WITH CHECK ADD FOREIGN KEY([CustomerID])
REFERENCES [dbo].[Customers] ([CustomerID])
GO
ALTER TABLE [dbo].[CheckIns]  WITH CHECK ADD FOREIGN KEY([SessionID])
REFERENCES [dbo].[Sessions] ([SessionID])
GO
ALTER TABLE [dbo].[SessionGroups]  WITH CHECK ADD FOREIGN KEY([GroupID])
REFERENCES [dbo].[Groups] ([GroupID])
GO
ALTER TABLE [dbo].[SessionGroups]  WITH CHECK ADD FOREIGN KEY([SessionID])
REFERENCES [dbo].[Sessions] ([SessionID])
GO
ALTER TABLE [dbo].[SessionUserGroups]  WITH CHECK ADD  CONSTRAINT [FK__SessionUs__Group__34C8D9D1] FOREIGN KEY([GroupID])
REFERENCES [dbo].[Groups] ([GroupID])
GO
ALTER TABLE [dbo].[SessionUserGroups] CHECK CONSTRAINT [FK__SessionUs__Group__34C8D9D1]
GO
ALTER TABLE [dbo].[SessionUserGroups]  WITH CHECK ADD  CONSTRAINT [FK__SessionUs__Sessi__35BCFE0A] FOREIGN KEY([SessionID])
REFERENCES [dbo].[Sessions] ([SessionID])
GO
ALTER TABLE [dbo].[SessionUserGroups] CHECK CONSTRAINT [FK__SessionUs__Sessi__35BCFE0A]
GO
ALTER TABLE [dbo].[SessionUserGroups]  WITH CHECK ADD  CONSTRAINT [FK__SessionUs__UserI__36B12243] FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[SessionUserGroups] CHECK CONSTRAINT [FK__SessionUs__UserI__36B12243]
GO
/****** Object:  StoredProcedure [dbo].[sp_CheckInByQRCode]    Script Date: 14/04/2025 10:56:08 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_CheckInByQRCode]
  @UserId INT,
  @SessionId INT,
  @QrCode nvarchar(255),
  @CustomerId int OUTPUT
AS
BEGIN
  SET NOCOUNT ON;
  
  ---- Kiểm tra xem người dùng đã check-in chưa
  --IF EXISTS (
  --  SELECT 1 FROM CheckInLogs
  --  WHERE UserId = @UserId AND SessionId = @SessionId
  --)
  --BEGIN
  --  SET @ResultMessage = N'Người dùng đã check-in trước đó.';
  --  RETURN;
  --END

  select @CustomerId = CustomerID from Customers where QRCode = TRIM(@QrCode)

  -- Thêm bản ghi check-in mới
  BEGIN TRY
    INSERT INTO CheckIns (CustomerID, SessionId, CheckedInBy, CheckedInAt)
    VALUES (@customerID, @SessionId, @UserId, GETDATE() );
    
  END TRY
  BEGIN CATCH
    SET @CustomerId = 0
  END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[usp_CheckLogin]    Script Date: 14/04/2025 10:56:08 SA ******/
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
/****** Object:  StoredProcedure [dbo].[usp_CreateUser]    Script Date: 14/04/2025 10:56:08 SA ******/
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
USE [master]
GO
ALTER DATABASE [CheckinDB] SET  READ_WRITE 
GO
