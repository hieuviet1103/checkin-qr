USE [CheckinDB]
GO
/****** Object:  Table [dbo].[SessionGroups]    Script Date: 14/04/2025 10:58:20 SA ******/
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
ALTER TABLE [dbo].[SessionGroups]  WITH CHECK ADD FOREIGN KEY([GroupID])
REFERENCES [dbo].[Groups] ([GroupID])
GO
ALTER TABLE [dbo].[SessionGroups]  WITH CHECK ADD FOREIGN KEY([SessionID])
REFERENCES [dbo].[Sessions] ([SessionID])
GO
