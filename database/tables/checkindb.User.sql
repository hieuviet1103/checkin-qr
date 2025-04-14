USE [CheckinDB]
GO
/****** Object:  User [checkindb]    Script Date: 14/04/2025 10:58:20 SA ******/
CREATE USER [checkindb] FOR LOGIN [checkindb] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [checkindb]
GO
ALTER ROLE [db_datareader] ADD MEMBER [checkindb]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [checkindb]
GO
