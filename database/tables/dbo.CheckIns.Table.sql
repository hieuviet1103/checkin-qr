USE [CheckinDB]
GO
/****** Object:  Table [dbo].[CheckIns]    Script Date: 14/04/2025 10:58:20 SA ******/
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
ALTER TABLE [dbo].[CheckIns] ADD  DEFAULT (getdate()) FOR [CheckedInAt]
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
