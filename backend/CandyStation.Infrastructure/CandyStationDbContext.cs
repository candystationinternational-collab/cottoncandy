using CandyStation.Core.Entities;
using CandyStation.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace CandyStation.Infrastructure;

public class CandyStationDbContext(DbContextOptions<CandyStationDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<Bundle> Bundles => Set<Bundle>();
    public DbSet<BundleItem> BundleItems => Set<BundleItem>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<CustomerAddress> CustomerAddresses => Set<CustomerAddress>();
    public DbSet<DeliveryZone> DeliveryZones => Set<DeliveryZone>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<OrderTimelineEntry> OrderTimelineEntries => Set<OrderTimelineEntry>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<Settings> Settings => Set<Settings>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Category>(e =>
        {
            e.Property(x => x.Name).HasMaxLength(100).IsRequired();
            e.Property(x => x.Description).HasMaxLength(500);
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
        });

        b.Entity<Product>(e =>
        {
            e.Property(x => x.Name).HasMaxLength(150).IsRequired();
            e.Property(x => x.Description).HasMaxLength(2000);
            e.Property(x => x.Ingredients).HasMaxLength(1000);
            e.Property(x => x.ServingSize).HasMaxLength(50);
            e.Property(x => x.Fat).HasMaxLength(50);
            e.Property(x => x.Carbs).HasMaxLength(50);
            e.Property(x => x.Protein).HasMaxLength(50);
            e.Property(x => x.Price).HasColumnType("decimal(10,2)");
            e.Property(x => x.CompareAtPrice).HasColumnType("decimal(10,2)");
            e.Property(x => x.CostPrice).HasColumnType("decimal(10,2)");
            e.Property(x => x.Sku).HasMaxLength(50).IsRequired();
            e.HasIndex(x => x.Sku).IsUnique();
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.Weight).HasMaxLength(20);
            e.Property(x => x.FlavorTags).HasMaxLength(500);
            e.Property(x => x.CandyColor).HasMaxLength(9).IsRequired();
            e.Property(x => x.Rating).HasColumnType("decimal(2,1)");
            e.HasOne(x => x.Category).WithMany(c => c.Products).HasForeignKey(x => x.CategoryId);
        });

        b.Entity<ProductVariant>(e =>
        {
            e.Property(x => x.Name).HasMaxLength(100).IsRequired();
            e.Property(x => x.Price).HasColumnType("decimal(10,2)");
            e.HasOne(x => x.Product).WithMany(p => p.Variants).HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Cascade);
        });

        b.Entity<Bundle>(e =>
        {
            e.Property(x => x.Name).HasMaxLength(150).IsRequired();
            e.Property(x => x.Description).HasMaxLength(1000);
            e.Property(x => x.Price).HasColumnType("decimal(10,2)");
            e.Property(x => x.CompareAtPrice).HasColumnType("decimal(10,2)");
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
        });

        b.Entity<BundleItem>(e =>
        {
            e.HasOne(x => x.Bundle).WithMany(bd => bd.Items).HasForeignKey(x => x.BundleId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Product).WithMany().HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Restrict);
        });

        b.Entity<Customer>(e =>
        {
            e.Property(x => x.Name).HasMaxLength(150).IsRequired();
            e.Property(x => x.Email).HasMaxLength(150).IsRequired();
            e.HasIndex(x => x.Email).IsUnique();
            e.Property(x => x.Phone).HasMaxLength(30);
            e.Property(x => x.PasswordHash).HasMaxLength(256).IsRequired();
            e.Property(x => x.TotalSpent).HasColumnType("decimal(10,2)");
            e.Property(x => x.EmailVerificationToken).HasMaxLength(64);
            e.Property(x => x.PasswordResetToken).HasMaxLength(64);
        });

        b.Entity<CustomerAddress>(e =>
        {
            e.Property(x => x.Label).HasMaxLength(50);
            e.Property(x => x.Name).HasMaxLength(150).IsRequired();
            e.Property(x => x.Phone).HasMaxLength(30).IsRequired();
            e.Property(x => x.Address1).HasMaxLength(200).IsRequired();
            e.Property(x => x.Address2).HasMaxLength(200);
            e.Property(x => x.City).HasMaxLength(100).IsRequired();
            e.Property(x => x.State).HasMaxLength(100).IsRequired();
            e.Property(x => x.PostalCode).HasMaxLength(20).IsRequired();
            e.Property(x => x.Country).HasMaxLength(100).IsRequired();
            e.HasOne(x => x.Customer).WithMany(c => c.Addresses).HasForeignKey(x => x.CustomerId).OnDelete(DeleteBehavior.Cascade);
        });

        b.Entity<DeliveryZone>(e =>
        {
            e.Property(x => x.Name).HasMaxLength(50).IsRequired();
            e.Property(x => x.Description).HasMaxLength(200);
            e.Property(x => x.Cost).HasColumnType("decimal(10,2)");
        });

        b.Entity<Order>(e =>
        {
            e.Property(x => x.OrderNumber).HasMaxLength(20).IsRequired();
            e.HasIndex(x => x.OrderNumber).IsUnique();
            e.Property(x => x.CustomerName).HasMaxLength(150).IsRequired();
            e.Property(x => x.CustomerEmail).HasMaxLength(150).IsRequired();
            e.Property(x => x.CustomerPhone).HasMaxLength(30).IsRequired();
            e.Property(x => x.Subtotal).HasColumnType("decimal(10,2)");
            e.Property(x => x.Shipping).HasColumnType("decimal(10,2)");
            e.Property(x => x.Total).HasColumnType("decimal(10,2)");
            e.Property(x => x.PaymentMethod).HasMaxLength(20).IsRequired();
            e.Property(x => x.DeliveryMethod).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.Notes).HasMaxLength(1000);
            e.HasOne(x => x.Customer).WithMany().HasForeignKey(x => x.CustomerId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.DeliveryZone).WithMany().HasForeignKey(x => x.DeliveryZoneId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.ShippingAddress).WithMany().HasForeignKey(x => x.ShippingAddressId).OnDelete(DeleteBehavior.Restrict);
        });

        b.Entity<OrderItem>(e =>
        {
            e.Property(x => x.ProductName).HasMaxLength(150).IsRequired();
            e.Property(x => x.VariantName).HasMaxLength(100).IsRequired();
            e.Property(x => x.UnitPrice).HasColumnType("decimal(10,2)");
            e.Property(x => x.LineTotal).HasColumnType("decimal(10,2)");
            e.HasOne(x => x.Order).WithMany(o => o.Items).HasForeignKey(x => x.OrderId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Product).WithMany().HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Bundle).WithMany().HasForeignKey(x => x.BundleId).OnDelete(DeleteBehavior.Restrict);
        });

        b.Entity<OrderTimelineEntry>(e =>
        {
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
            e.HasOne(x => x.Order).WithMany(o => o.Timeline).HasForeignKey(x => x.OrderId).OnDelete(DeleteBehavior.Cascade);
        });

        b.Entity<AdminUser>(e =>
        {
            e.Property(x => x.Username).HasMaxLength(50).IsRequired();
            e.HasIndex(x => x.Username).IsUnique();
            e.Property(x => x.PasswordHash).HasMaxLength(256).IsRequired();
            e.Property(x => x.DisplayName).HasMaxLength(100);
            e.Property(x => x.Role).HasConversion<string>().HasMaxLength(20);
        });

        b.Entity<Settings>(e =>
        {
            e.Property(x => x.StoreName).HasMaxLength(150).IsRequired();
            e.Property(x => x.StoreAddress).HasMaxLength(300);
            e.Property(x => x.StorePhone).HasMaxLength(30);
            e.Property(x => x.StoreEmail).HasMaxLength(150);
            e.Property(x => x.StoreHours).HasMaxLength(100);
            e.Property(x => x.Currency).HasMaxLength(10).IsRequired();
            e.Property(x => x.PickupAddress).HasMaxLength(300);
            e.Property(x => x.PickupHours).HasMaxLength(100);
            e.Property(x => x.CodMinOrder).HasColumnType("decimal(10,2)");
            e.Property(x => x.CodMaxOrder).HasColumnType("decimal(10,2)");
            e.Property(x => x.CodInstructions).HasMaxLength(500);
            e.Property(x => x.TaxRate).HasColumnType("decimal(5,2)");
            e.Property(x => x.ShippingPolicy).HasMaxLength(2000);
        });
    }
}
