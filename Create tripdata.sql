/****** Object:  Table [dbo].[AccessTokens]    Script Date: 5/7/2013 11:45:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AccessTokens](
	[AccessTokenId] [bigint] IDENTITY(1,1) NOT NULL,
	[IssuedOn] [datetime] NOT NULL,
	[ExpiresOn] [datetime] NOT NULL,
	[Token] [nvarchar](max) NULL,
 CONSTRAINT [PK_dbo.AccessTokens] PRIMARY KEY CLUSTERED 
(
	[AccessTokenId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Cars]    Script Date: 5/7/2013 11:45:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Cars](
	[CarId] [bigint] IDENTITY(1,1) NOT NULL,
	[LicensePlateNumber] [nvarchar](max) NOT NULL,
	[Make] [nvarchar](max) NOT NULL,
	[Model] [nvarchar](max) NOT NULL,
	[IsCurrentCar] [bit] NOT NULL,
	[DriverId] [bigint] NOT NULL,
 CONSTRAINT [PK_dbo.Cars] PRIMARY KEY CLUSTERED 
(
	[CarId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Drivers]    Script Date: 5/7/2013 11:45:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Drivers](
	[DriverId] [bigint] IDENTITY(1,1) NOT NULL,
	[LastName] [nvarchar](max) NULL,
	[FirstName] [nvarchar](max) NULL,
	[EmailAddress] [nvarchar](max) NOT NULL,
	[Password] [nvarchar](max) NOT NULL,
	[Salt] [nvarchar](max) NULL,
	[Token_AccessTokenId] [bigint] NULL,
 CONSTRAINT [PK_dbo.Drivers] PRIMARY KEY CLUSTERED 
(
	[DriverId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Trips]    Script Date: 5/7/2013 11:45:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Trips](
	[TripId] [bigint] IDENTITY(1,1) NOT NULL,
	[StartMilage] [int] NULL,
	[EndMilage] [int] NULL,
	[DateTime] [datetime] NOT NULL,
	[PlaceOfDeparture] [nvarchar](max) NULL,
	[Destination] [nvarchar](max) NULL,
	[DepartureZipCode] [nvarchar](max) NULL,
	[DestinationZipCode] [nvarchar](max) NULL,
	[Description] [nvarchar](max) NULL,
	[TripType] [int] NOT NULL,
	[DriverId] [bigint] NOT NULL,
	[CarId] [bigint] NULL,
 CONSTRAINT [PK_dbo.Trips] PRIMARY KEY CLUSTERED 
(
	[TripId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
ALTER TABLE [dbo].[Cars]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Cars_dbo.Drivers_DriverId] FOREIGN KEY([DriverId])
REFERENCES [dbo].[Drivers] ([DriverId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Cars] CHECK CONSTRAINT [FK_dbo.Cars_dbo.Drivers_DriverId]
GO
ALTER TABLE [dbo].[Drivers]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Drivers_dbo.AccessTokens_Token_AccessTokenId] FOREIGN KEY([Token_AccessTokenId])
REFERENCES [dbo].[AccessTokens] ([AccessTokenId])
GO
ALTER TABLE [dbo].[Drivers] CHECK CONSTRAINT [FK_dbo.Drivers_dbo.AccessTokens_Token_AccessTokenId]
GO
ALTER TABLE [dbo].[Trips]  WITH CHECK ADD  CONSTRAINT [FK_dbo.Trips_dbo.Drivers_DriverId] FOREIGN KEY([DriverId])
REFERENCES [dbo].[Drivers] ([DriverId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Trips] CHECK CONSTRAINT [FK_dbo.Trips_dbo.Drivers_DriverId]
GO
