USE [CheckinDB]
GO
/****** Object:  StoredProcedure [dbo].[sp_CheckInByQRCode]    Script Date: 14/04/2025 10:58:20 SA ******/
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
