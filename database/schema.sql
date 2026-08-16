IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE TABLE [AdminUsers] (
        [Id] int NOT NULL IDENTITY,
        [Username] nvarchar(50) NOT NULL,
        [PasswordHash] nvarchar(256) NOT NULL,
        [DisplayName] nvarchar(100) NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_AdminUsers] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE TABLE [Bundles] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(150) NOT NULL,
        [Description] nvarchar(1000) NULL,
        [Price] decimal(10,2) NOT NULL,
        [CompareAtPrice] decimal(10,2) NULL,
        [Status] nvarchar(20) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Bundles] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE TABLE [Categories] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(100) NOT NULL,
        [Description] nvarchar(500) NULL,
        [DisplayOrder] int NOT NULL,
        [Status] nvarchar(20) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Categories] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE TABLE [Customers] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(150) NOT NULL,
        [Email] nvarchar(150) NOT NULL,
        [Phone] nvarchar(30) NULL,
        [PasswordHash] nvarchar(256) NOT NULL,
        [JoinedDate] datetime2 NOT NULL,
        [OrdersCount] int NOT NULL,
        [TotalSpent] decimal(10,2) NOT NULL,
        CONSTRAINT [PK_Customers] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE TABLE [DeliveryZones] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(50) NOT NULL,
        [Description] nvarchar(200) NULL,
        [Cost] decimal(10,2) NOT NULL,
        [Enabled] bit NOT NULL,
        CONSTRAINT [PK_DeliveryZones] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE TABLE [Settings] (
        [Id] int NOT NULL IDENTITY,
        [StoreName] nvarchar(150) NOT NULL,
        [StoreAddress] nvarchar(300) NULL,
        [StorePhone] nvarchar(30) NULL,
        [StoreEmail] nvarchar(150) NULL,
        [StoreHours] nvarchar(100) NULL,
        [Currency] nvarchar(10) NOT NULL,
        [PickupAddress] nvarchar(300) NULL,
        [PickupHours] nvarchar(100) NULL,
        [CodEnabled] bit NOT NULL,
        [CodMinOrder] decimal(10,2) NOT NULL,
        [CodMaxOrder] decimal(10,2) NOT NULL,
        [CodInstructions] nvarchar(500) NULL,
        [TaxRate] decimal(5,2) NOT NULL,
        [ShippingPolicy] nvarchar(2000) NULL,
        CONSTRAINT [PK_Settings] PRIMARY KEY ([Id])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE TABLE [Products] (
        [Id] int NOT NULL IDENTITY,
        [CategoryId] int NOT NULL,
        [Name] nvarchar(150) NOT NULL,
        [Description] nvarchar(2000) NULL,
        [Ingredients] nvarchar(1000) NULL,
        [ServingSize] nvarchar(50) NULL,
        [Calories] int NULL,
        [Fat] nvarchar(50) NULL,
        [Carbs] nvarchar(50) NULL,
        [Protein] nvarchar(50) NULL,
        [Price] decimal(10,2) NOT NULL,
        [CompareAtPrice] decimal(10,2) NULL,
        [CostPrice] decimal(10,2) NULL,
        [Stock] int NOT NULL,
        [Sku] nvarchar(50) NOT NULL,
        [Status] nvarchar(20) NOT NULL,
        [Weight] nvarchar(20) NULL,
        [FlavorTags] nvarchar(500) NULL,
        [CandyColor] nvarchar(9) NOT NULL,
        [Rating] decimal(2,1) NOT NULL,
        [ReviewCount] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Products] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Products_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE TABLE [CustomerAddresses] (
        [Id] int NOT NULL IDENTITY,
        [CustomerId] int NOT NULL,
        [Label] nvarchar(50) NULL,
        [Name] nvarchar(150) NOT NULL,
        [Phone] nvarchar(30) NOT NULL,
        [Address1] nvarchar(200) NOT NULL,
        [Address2] nvarchar(200) NULL,
        [City] nvarchar(100) NOT NULL,
        [State] nvarchar(100) NOT NULL,
        [PostalCode] nvarchar(20) NOT NULL,
        [Country] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_CustomerAddresses] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_CustomerAddresses_Customers_CustomerId] FOREIGN KEY ([CustomerId]) REFERENCES [Customers] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE TABLE [BundleItems] (
        [Id] int NOT NULL IDENTITY,
        [BundleId] int NOT NULL,
        [ProductId] int NOT NULL,
        [Quantity] int NOT NULL,
        CONSTRAINT [PK_BundleItems] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_BundleItems_Bundles_BundleId] FOREIGN KEY ([BundleId]) REFERENCES [Bundles] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_BundleItems_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE TABLE [ProductVariants] (
        [Id] int NOT NULL IDENTITY,
        [ProductId] int NOT NULL,
        [Name] nvarchar(100) NOT NULL,
        [Price] decimal(10,2) NOT NULL,
        [SortOrder] int NOT NULL,
        CONSTRAINT [PK_ProductVariants] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ProductVariants_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE TABLE [Orders] (
        [Id] int NOT NULL IDENTITY,
        [OrderNumber] nvarchar(20) NOT NULL,
        [CustomerId] int NULL,
        [CustomerName] nvarchar(150) NOT NULL,
        [CustomerEmail] nvarchar(150) NOT NULL,
        [CustomerPhone] nvarchar(30) NOT NULL,
        [Subtotal] decimal(10,2) NOT NULL,
        [Shipping] decimal(10,2) NOT NULL,
        [Total] decimal(10,2) NOT NULL,
        [PaymentMethod] nvarchar(20) NOT NULL,
        [DeliveryMethod] nvarchar(20) NOT NULL,
        [DeliveryZoneId] int NULL,
        [ShippingAddressId] int NULL,
        [Status] nvarchar(20) NOT NULL,
        [Notes] nvarchar(1000) NULL,
        [PlacedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Orders] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Orders_CustomerAddresses_ShippingAddressId] FOREIGN KEY ([ShippingAddressId]) REFERENCES [CustomerAddresses] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Orders_Customers_CustomerId] FOREIGN KEY ([CustomerId]) REFERENCES [Customers] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Orders_DeliveryZones_DeliveryZoneId] FOREIGN KEY ([DeliveryZoneId]) REFERENCES [DeliveryZones] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE TABLE [OrderItems] (
        [Id] int NOT NULL IDENTITY,
        [OrderId] int NOT NULL,
        [ProductId] int NULL,
        [BundleId] int NULL,
        [ProductName] nvarchar(150) NOT NULL,
        [VariantName] nvarchar(100) NOT NULL,
        [UnitPrice] decimal(10,2) NOT NULL,
        [Quantity] int NOT NULL,
        [LineTotal] decimal(10,2) NOT NULL,
        CONSTRAINT [PK_OrderItems] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_OrderItems_Bundles_BundleId] FOREIGN KEY ([BundleId]) REFERENCES [Bundles] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_OrderItems_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_OrderItems_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE TABLE [OrderTimelineEntries] (
        [Id] int NOT NULL IDENTITY,
        [OrderId] int NOT NULL,
        [Status] nvarchar(20) NOT NULL,
        [ChangedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_OrderTimelineEntries] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_OrderTimelineEntries_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([Id]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_AdminUsers_Username] ON [AdminUsers] ([Username]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_BundleItems_BundleId] ON [BundleItems] ([BundleId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_BundleItems_ProductId] ON [BundleItems] ([ProductId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_CustomerAddresses_CustomerId] ON [CustomerAddresses] ([CustomerId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Customers_Email] ON [Customers] ([Email]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_OrderItems_BundleId] ON [OrderItems] ([BundleId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_OrderItems_OrderId] ON [OrderItems] ([OrderId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_OrderItems_ProductId] ON [OrderItems] ([ProductId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Orders_CustomerId] ON [Orders] ([CustomerId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Orders_DeliveryZoneId] ON [Orders] ([DeliveryZoneId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Orders_OrderNumber] ON [Orders] ([OrderNumber]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Orders_ShippingAddressId] ON [Orders] ([ShippingAddressId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_OrderTimelineEntries_OrderId] ON [OrderTimelineEntries] ([OrderId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Products_CategoryId] ON [Products] ([CategoryId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Products_Sku] ON [Products] ([Sku]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_ProductVariants_ProductId] ON [ProductVariants] ([ProductId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813100625_InitialCreate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260813100625_InitialCreate', N'10.0.11');
END;

COMMIT;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813101540_MakeCustomerAddressCustomerIdNullable'
)
BEGIN
    DECLARE @var nvarchar(max);
    SELECT @var = QUOTENAME([d].[name])
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[CustomerAddresses]') AND [c].[name] = N'CustomerId');
    IF @var IS NOT NULL EXEC(N'ALTER TABLE [CustomerAddresses] DROP CONSTRAINT ' + @var + ';');
    ALTER TABLE [CustomerAddresses] ALTER COLUMN [CustomerId] int NULL;
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260813101540_MakeCustomerAddressCustomerIdNullable'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260813101540_MakeCustomerAddressCustomerIdNullable', N'10.0.11');
END;

COMMIT;
GO

