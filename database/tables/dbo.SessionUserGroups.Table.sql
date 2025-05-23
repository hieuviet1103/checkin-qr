USE [CheckinDB]
GO
/****** Object:  Table [dbo].[SessionUserGroups]    Script Date: 14/04/2025 10:58:20 SA ******/
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
