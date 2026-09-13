using CandyStation.Core.Entities;
using CandyStation.Core.Enums;
using Microsoft.AspNetCore.Identity;

namespace CandyStation.Infrastructure;

public static class DbInitializer
{
    public static void Seed(CandyStationDbContext db)
    {
        if (db.Products.Any()) return; // idempotent — only seed an empty database

        var categories = new[]
        {
            new Category { Name = "Classic", Description = "Timeless flavors everyone loves", DisplayOrder = 1 },
            new Category { Name = "Fruity", Description = "Bright, juicy, fruit-forward spins", DisplayOrder = 2 },
            new Category { Name = "Fresh & Cool", Description = "Cooling, refreshing flavors", DisplayOrder = 3 },
            new Category { Name = "Indulgent", Description = "Rich, dessert-inspired treats", DisplayOrder = 4 },
        };
        db.Categories.AddRange(categories);
        db.SaveChanges();

        var classic = categories[0];
        var fruity = categories[1];
        var fresh = categories[2];
        var indulgent = categories[3];

        Product MakeProduct(string name, Category cat, string desc, string ingredients, int calories,
            string sku, string tags, string color, decimal rating, int reviews, int stock, string? images = null)
        {
            var p = new Product
            {
                Name = name,
                CategoryId = cat.Id,
                Description = desc,
                Ingredients = ingredients,
                ServingSize = "50 g",
                Calories = calories,
                Fat = "0 g",
                Carbs = "45 g",
                Protein = "0 g",
                Price = 200,
                Stock = stock,
                Sku = sku,
                Weight = "50 g / 150 g",
                FlavorTags = tags,
                Images = images,
                CandyColor = color,
                Rating = rating,
                ReviewCount = reviews,
            };
            p.Variants.Add(new ProductVariant { Name = "Single Pack (50 g)", Price = 200, SortOrder = 1 });
            p.Variants.Add(new ProductVariant { Name = "Family Pack (150 g)", Price = 500, SortOrder = 2 });
            return p;
        }

        // Real product photos live in the frontend's /public/product-images — referenced here by
        // relative path so they resolve against whatever domain the frontend is served from.
        static string PhotosFor(string flavor) => $"/product-images/{flavor}/1.png,/product-images/{flavor}/2.png,/product-images/{flavor}/3.png";

        var strawberry = MakeProduct("Strawberry Dream", fruity,
            "A sweet and fruity treat packed with the delicious taste of strawberries. Light, fluffy, and bursting with flavor, Strawberry Dream is perfect for satisfying your sweet cravings and adding a touch of happiness to any moment.",
            "Sugar, natural strawberry flavoring, food-grade color (E120)", 180, "CS-STR-001", "strawberry,fruity,sweet", "#F90264", 4.8m, 132, 84, PhotosFor("strawberry"));

        var blueberry = MakeProduct("Blueberry Bliss", fruity,
            "Enjoy the rich and refreshing taste of blueberries in every bite. Blueberry Bliss offers a smooth and delightful experience, making it the perfect companion for parties, movie nights, and celebrations.",
            "Sugar, natural blueberry flavoring, food-grade color (E133)", 178, "CS-BLU-002", "blueberry,fruity", "#7E02E8", 4.7m, 98, 76, PhotosFor("blueberry"));

        var orange = MakeProduct("Orange Burst", fruity,
            "Bright, vibrant, and full of citrus goodness, Orange Burst delivers a refreshing sweetness that's impossible to resist. Its cheerful flavor makes every occasion extra special.",
            "Sugar, natural orange flavoring, food-grade color (E160a)", 182, "CS-ORN-003", "orange,citrus,fruity", "#FD7603", 4.6m, 74, 91, PhotosFor("orange"));

        var mint = MakeProduct("Mint Fresh", fresh,
            "Cool, refreshing, and delightfully sweet, Mint Fresh combines a burst of mint flavor with soft cotton candy to create a unique and satisfying treat.",
            "Sugar, natural mint flavoring, food-grade color (E102)", 175, "CS-MNT-004", "mint,cooling,fresh", "#9DC403", 4.5m, 51, 68, PhotosFor("mint"));

        var coffee = MakeProduct("Coffee Delight", indulgent,
            "A perfect choice for coffee lovers, Coffee Delight blends rich coffee notes with a sweet and fluffy texture, creating an indulgent experience in every bite.",
            "Sugar, natural coffee flavoring, food-grade color (caramel)", 185, "CS-COF-005", "coffee,indulgent", "#6B4226", 4.9m, 143, 60, PhotosFor("coffee"));

        var vanilla = MakeProduct("Vanilla Bliss", classic,
            "Smooth, creamy, and timeless, Vanilla Bliss offers a classic flavor that everyone loves. Its delicate sweetness and soft texture make it perfect for any occasion.",
            "Sugar, natural vanilla flavoring", 176, "CS-VAN-006", "vanilla,classic", "#FFF8EE", 4.7m, 112, 100, PhotosFor("vanilla"));

        var products = new[] { strawberry, blueberry, orange, mint, coffee, vanilla };
        db.Products.AddRange(products);
        db.SaveChanges();

        var familyMegaBox = new Bundle
        {
            Name = "Family Mega Box",
            Description = "One of every flavor — the full Candy Station lineup in one box.",
            Price = 1000,
            CompareAtPrice = 1200,
            Items = products.Select(p => new BundleItem { ProductId = p.Id, Quantity = 1 }).ToList(),
        };

        db.Bundles.AddRange(
            new Bundle
            {
                Name = "Duo Pack",
                Description = "Strawberry Dream + Blueberry Bliss — a fruity pair at a better price.",
                Price = 350,
                CompareAtPrice = 400,
                Items =
                [
                    new BundleItem { ProductId = strawberry.Id, Quantity = 1 },
                    new BundleItem { ProductId = blueberry.Id, Quantity = 1 },
                ],
            },
            new Bundle
            {
                Name = "Party Pack",
                Description = "Strawberry Dream + Orange Burst + Mint Fresh — three crowd-pleasing flavors.",
                Price = 500,
                CompareAtPrice = 600,
                Items =
                [
                    new BundleItem { ProductId = strawberry.Id, Quantity = 1 },
                    new BundleItem { ProductId = orange.Id, Quantity = 1 },
                    new BundleItem { ProductId = mint.Id, Quantity = 1 },
                ],
            },
            familyMegaBox
        );
        db.SaveChanges();

        db.HeroSlides.AddRange(
            new HeroSlide
            {
                DisplayOrder = 1,
                BackgroundColor = "#FFF4F8",
                ItemType = HeroItemType.Product,
                ProductId = strawberry.Id,
                TitleOverride = "Cloud-Soft Cotton Candy",
                SubtitleOverride = "Handcrafted flavor clouds made fresh in Nepal. Six signature flavors, zero gradients, 100% happiness.",
                CtaLabel = "Shop Flavors",
            },
            new HeroSlide
            {
                DisplayOrder = 2,
                BackgroundColor = "#2D0A31",
                ItemType = HeroItemType.Bundle,
                BundleId = familyMegaBox.Id,
            },
            new HeroSlide
            {
                DisplayOrder = 3,
                BackgroundColor = "#EAF6FF",
                ItemType = HeroItemType.Product,
                ProductId = blueberry.Id,
            }
        );

        db.DeliveryZones.AddRange(
            new DeliveryZone { Name = "Zone A", Description = "Within Kathmandu ring (up to 5 km)", Cost = 100 },
            new DeliveryZone { Name = "Zone B", Description = "Kathmandu Valley (5–15 km)", Cost = 200 },
            new DeliveryZone { Name = "Zone C", Description = "Bhaktapur / Lalitpur outskirts (15–30 km)", Cost = 300 },
            new DeliveryZone { Name = "Zone D", Description = "Beyond 30 km", Cost = 400 }
        );

        db.Settings.Add(new Settings
        {
            StoreName = "Candy Station",
            StoreAddress = "Durbar Marg, Kathmandu, Nepal",
            StorePhone = "+977 01-4XXXXXX",
            StoreEmail = "hello@candystation.com.np",
            StoreHours = "11:00 AM – 9:00 PM, all week",
            Currency = "NPR",
            PickupAddress = "Candy Station Flagship, Durbar Marg, Kathmandu",
            PickupHours = "11:00 AM – 9:00 PM",
            CodEnabled = true,
            CodMinOrder = 0,
            CodMaxOrder = 10000,
            CodInstructions = "Pay in cash to our delivery rider when your order arrives. Please keep exact change ready where possible.",
            TaxRate = 0,
            ShippingPolicy = "Orders are dispatched same-day for Kathmandu Valley addresses when placed before 5 PM. Delivery fees are calculated by zone at checkout.",
        });

        var hasher = new PasswordHasher<object>();
        db.AdminUsers.Add(new AdminUser
        {
            Username = "Rubalbasnet06@gmail.com",
            PasswordHash = hasher.HashPassword(null!, "CandyStation#Rubal2026!"),
            DisplayName = "Rubal Basnet",
            IsActive = true,
            Role = StaffRole.Admin,
        });
        db.AdminUsers.Add(new AdminUser
        {
            Username = "rider1",
            PasswordHash = hasher.HashPassword(null!, "CandyStation#Rider2026!"),
            DisplayName = "Bikash (Delivery)",
            IsActive = true,
            Role = StaffRole.Delivery,
        });

        var demoCustomer = new Customer
        {
            Name = "Aarav Shrestha",
            Email = "aarav@example.com",
            Phone = "+977 98XXXXXXXX",
            PasswordHash = hasher.HashPassword(null!, "CandyStation#Aarav2026!"),
            JoinedDate = DateTime.UtcNow.AddMonths(-3),
            IsEmailVerified = true, // seed/demo account skips the real verification flow
        };
        db.Customers.Add(demoCustomer);

        db.SaveChanges();
    }
}
