using CandyStation.Core.Entities;
using CandyStation.Core.Enums;
using Microsoft.AspNetCore.Identity;

namespace CandyStation.Infrastructure;

public static class DbInitializer
{
    private const string PrivacyPolicyText = """
        Effective Date: September 2026 | Last Updated: September 2026

        Your privacy matters to us. This Privacy Policy explains how Candy Station collects, uses, stores, and protects your personal information when you visit or make a purchase from our website (candystation.com.np). By using our website, you agree to the practices described in this policy.

        1. Information We Collect

        When you interact with Candy Station, we may collect the following types of information:

        1.1 Personal Information You Provide
        - Full name and email address (when you create an account or place an order)
        - Delivery address and contact phone number
        - Payment information (processed securely via third-party payment gateways — we do not store card details)
        - Order history and preferences
        - Messages or feedback submitted through contact forms

        1.2 Automatically Collected Information
        - IP address, browser type, and device information
        - Pages visited, time spent on site, and clickstream data
        - Cookies and similar tracking technologies (see Section 6)

        1.3 Information from Third Parties
        - Payment processors (e.g., transaction confirmation details)
        - Delivery partners (e.g., shipping status updates)

        2. How We Use Your Information

        We use the information we collect for the following purposes:
        - Order Fulfillment — process and deliver your orders, send confirmation and tracking updates
        - Account Management — create and maintain your customer account securely
        - Customer Support — respond to queries, refund/return requests, and complaints
        - Personalization — remember your preferences and show relevant products
        - Marketing (Optional) — send promotional offers and updates, only with your consent
        - Legal Compliance — meet tax, accounting, and regulatory obligations in Nepal
        - Site Improvement — analyze usage data to improve website performance and user experience

        3. How We Share Your Information

        Candy Station does not sell or rent your personal information to third parties. We may share your data only in the following limited circumstances:
        - Delivery partners — to fulfill and track your order shipments.
        - Payment processors — to securely process your transactions.
        - IT and platform service providers — who help operate our website (under strict confidentiality agreements).
        - Legal authorities — if required by law, court order, or to protect the rights and safety of Candy Station or its customers.

        All third parties we work with are required to handle your data securely and only for the specific purpose for which it is shared.

        4. Data Retention

        We retain your personal information for as long as necessary to:
        - Maintain your account and provide ongoing services
        - Comply with legal, tax, and regulatory requirements in Nepal
        - Resolve disputes or enforce our policies

        When your data is no longer needed, it will be securely deleted or anonymized.

        5. Your Rights

        As a customer, you have the following rights regarding your personal data:
        - Access — request a copy of the personal information we hold about you.
        - Correction — ask us to update or correct inaccurate information.
        - Deletion — request that we delete your personal data, subject to legal obligations.
        - Opt-Out — unsubscribe from marketing emails at any time using the unsubscribe link in our emails.
        - Data Portability — request your data in a commonly used, machine-readable format.

        To exercise any of these rights, please contact us at support@candystation.com.np.

        6. Cookies & Tracking Technologies

        Our website uses cookies and similar technologies to enhance your browsing experience. These include:
        - Essential cookies — required for the website to function (e.g., shopping cart, login sessions).
        - Analytics cookies — help us understand how visitors use our site (e.g., Google Analytics).
        - Preference cookies — remember your settings and preferences.

        You can manage or disable cookies through your browser settings. Note that disabling essential cookies may affect website functionality.

        7. Data Security

        We implement industry-standard security measures to protect your personal information, including:
        - SSL/TLS encryption for all data transmitted through our website
        - Secure third-party payment gateways — we never store full payment card details
        - Access controls that limit who within Candy Station can access your data
        - Regular security reviews and updates to our systems

        While we take every reasonable precaution, no method of data transmission over the internet is 100% secure. We encourage you to use a strong password and keep your account credentials confidential.

        8. Children's Privacy

        Our website and services are not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately and we will take steps to delete that information.

        9. Changes to This Privacy Policy

        We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. When we do, we will:
        - Update the "Last Updated" date at the top of this document
        - Post the revised policy on our website at candystation.com.np
        - Notify registered customers via email for significant changes

        Your continued use of our website after changes are posted constitutes your acceptance of the updated policy.

        10. Contact Us

        If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:

        Candy Station
        Website: https://candystation.com.np
        Email: support@candystation.com.np
        Support Hours: Sunday – Friday, 9:00 AM – 6:00 PM (NPT)

        Thank you for trusting Candy Station with your information. We are committed to keeping it safe and using it responsibly.
        """;

    private const string TermsOfServiceText = """
        Effective Date: September 2026 | Last Updated: September 2026

        IMPORTANT: Please read these Terms of Service ("ToS") carefully. By accessing or using candystation.com.np, creating an account, or purchasing any product from Candy Station, you agree to be legally bound by these terms. If you do not agree, please discontinue use of our website immediately.

        Quick Summary

        Here is a plain-language overview of our key service commitments. The full legal terms follow below.
        - Eligibility — you must be 13+ to use our site. By using it, you confirm this.
        - Shopping — browse and buy candy products safely through our website.
        - Payments — pay securely via available gateways. No card data stored by us.
        - Delivery — we ship within Nepal. Delivery charges are non-refundable.
        - Returns & Refunds — 24-hour window from purchase or delivery. See full policy.
        - Your Account — keep your credentials safe. You're responsible for account activity.
        - Your Rights — you can access, edit, or delete your data at any time.
        - Our Content — all website content belongs to Candy Station. Do not copy without permission.
        - Disputes — governed by the laws of Nepal.

        1. Acceptance of Terms

        By accessing, browsing, or using the Candy Station website (candystation.com.np) in any way, you confirm that:
        - You have read and understood these Terms of Service.
        - You are at least 13 years of age, or accessing the website under parental/guardian supervision.
        - You agree to be legally bound by these Terms of Service and all applicable laws and regulations of Nepal.
        - You consent to the collection and use of your information as described in our Privacy Policy.
        - If you are using the website on behalf of a business or organization, you represent that you have the authority to bind that entity to these terms.

        2. Description of Service

        Candy Station is an e-commerce platform that allows customers to browse, select, and purchase confectionery and candy products online. Our services include:
        - Product Listings: browsing and searching for available candy products on our website.
        - Order Placement: adding items to your cart and completing purchases through our secure checkout.
        - Account Management: creating and managing a personal account to track orders and save preferences.
        - Delivery: arranging the shipment of purchased products to your specified address within Nepal.
        - Customer Support: providing assistance for queries, complaints, and after-sale service.

        We reserve the right to modify, suspend, or discontinue any aspect of our service at any time without prior notice.

        3. User Eligibility & Accounts

        3.1 Eligibility
        Our services are available to individuals who are 13 years of age or older. Purchases involving age-restricted products (if any) may require additional verification. Candy Station reserves the right to refuse service to anyone at its sole discretion.

        3.2 Account Registration
        - You may be required to register for an account to place orders or access certain features.
        - You agree to provide accurate, current, and complete information during registration and keep it updated.
        - You are responsible for maintaining the confidentiality of your account password.
        - You are fully responsible for all activities that occur under your account.
        - Notify us immediately at support@candystation.com.np if you suspect unauthorized access to your account.

        3.3 Account Termination
        Candy Station may suspend or terminate your account at any time without notice if you violate these Terms of Service, engage in fraudulent activity, or abuse our platform or staff.

        4. Ordering & Payment

        4.1 Product Orders
        When you submit an order on our website, you are making a binding offer to purchase the selected item(s) at the listed price. Your order is confirmed only when you receive an order confirmation email from us. Candy Station reserves the right to accept or decline any order at its discretion. In the event of pricing errors or stock unavailability, we will notify you and offer alternatives or a full refund.

        4.2 Pricing & Taxes
        - All prices are displayed in Nepalese Rupees (NPR).
        - Prices are inclusive of applicable taxes unless stated otherwise.
        - Delivery charges are displayed separately at checkout and are non-refundable.
        - Candy Station reserves the right to modify prices at any time. The price at the time of order confirmation applies.

        4.3 Payment Methods
        - We accept payments via methods listed at checkout (e.g., eSewa, Khalti, bank transfer, cash on delivery where available).
        - All transactions are processed through secure, third-party payment gateways. Candy Station does not store full payment card details.
        - In the event of a failed payment, your order will not be processed. Please contact us if you experience payment issues.

        4.4 Order Cancellation
        - You may cancel an order within 2 hours of placement, provided it has not yet been dispatched.
        - To cancel, contact us at support@candystation.com.np with your order number as soon as possible.
        - Candy Station reserves the right to cancel orders due to stock issues, payment failure, suspected fraud, or errors, with a full refund issued to the original payment method.

        5. Delivery & Shipping
        - Coverage: we currently deliver within Nepal. Supported delivery areas are shown at checkout.
        - Timelines: estimated delivery times are provided as a guide only and may vary based on location, demand, weather, or other circumstances.
        - Delivery Charges: delivery fees are non-refundable, including in cases of approved refunds or returns, unless the cancellation is due to Candy Station's own error.
        - Failed Deliveries: if a delivery fails due to an incorrect address, recipient unavailability, or refusal to accept, additional re-delivery charges may apply.
        - Risk of Loss: once your order is delivered to the address you provided, the risk of loss or damage passes to you.

        6. Returns & Refund Policy

        Our return and refund terms are as follows. Please refer to the full Return & Refund Policy document for complete details.
        - Full Refund — within 24 hrs of purchase. Delivery charge not refunded.
        - Replacement — report damage/packaging within 24 hrs of receiving. Delivery charge not included.

        7. Acceptable Use Policy

        By using our website, you agree to use it only for lawful purposes. You must not:
        - Use the website to conduct illegal, fraudulent, or harmful activities.
        - Attempt to gain unauthorized access to any part of our systems, servers, or databases.
        - Submit false, misleading, or inaccurate information when placing orders or contacting support.
        - Use automated tools (bots, crawlers, scrapers) to access, extract, or monitor content without our written permission.
        - Post or transmit any abusive, defamatory, obscene, or threatening content through any form on our site.
        - Infringe on the intellectual property rights of Candy Station or any third party.
        - Disrupt or interfere with the security, integrity, or performance of our website or servers.

        Violations may result in immediate account suspension, cancellation of all pending orders, and/or legal action.

        8. Intellectual Property

        All content on candystation.com.np — including but not limited to:
        - Logo, brand name, and trademarks
        - Product images, descriptions, and photography
        - Website design, layout, graphics, and code
        - Written content, blog posts, and marketing materials

        — is the exclusive property of Candy Station and is protected under applicable copyright, trademark, and intellectual property laws of Nepal. You are granted a limited, non-exclusive, non-transferable license to access and use the website for personal, non-commercial purposes only. You may not reproduce, republish, distribute, modify, or commercially exploit any content without prior written consent from Candy Station.

        9. Third-Party Links & Services

        Our website may contain links to third-party websites (e.g., payment gateways, social media platforms, delivery partners). These links are provided for convenience only. Candy Station does not endorse or take responsibility for the content, practices, or policies of third-party websites. Your interactions with third-party services are governed by their own terms and privacy policies. We recommend reviewing the terms of any third-party service before providing your information.

        10. Disclaimers & Warranties

        Our website and services are provided on an "as is" and "as available" basis. To the fullest extent permitted by law, Candy Station makes no warranties — express or implied — including but not limited to:
        - Warranties of merchantability, fitness for a particular purpose, or non-infringement.
        - That the website will be uninterrupted, error-free, or free of viruses or harmful components.
        - That product descriptions, images, or prices are always completely accurate or up to date.

        We do not guarantee that orders will always be fulfilled due to stock availability or other unforeseen circumstances. In such cases, a full refund will be issued.

        11. Limitation of Liability

        To the maximum extent permitted by applicable law, Candy Station, its owners, employees, and partners shall not be liable for:
        - Any indirect, incidental, special, consequential, or punitive damages.
        - Loss of profits, revenue, data, or business opportunities arising from your use of our website or products.
        - Delays, errors, or failures resulting from circumstances beyond our reasonable control (force majeure), including natural disasters, power outages, government actions, or strikes.
        - Unauthorized access to or alteration of your data due to third-party breaches.

        In any event, Candy Station's total liability to you for any claim shall not exceed the total amount paid by you for the specific order giving rise to the claim.

        12. Indemnification

        You agree to indemnify, defend, and hold harmless Candy Station, its owners, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including legal fees) arising from:
        - Your breach of these Terms of Service.
        - Your use or misuse of the website or services.
        - Your violation of any applicable law or regulation.
        - Any content or information you submit through our website.

        13. Privacy Policy

        Your use of our website is subject to our Privacy Policy, which is incorporated into these Terms of Service by reference. Our Privacy Policy explains how we collect, use, store, and protect your personal information. By using our website, you consent to the practices described in the Privacy Policy. Please review our Privacy Policy document for full details.

        14. Modifications to the Service & Terms

        14.1 Changes to the Service
        Candy Station reserves the right to modify, suspend, or permanently discontinue any part of the website or service at any time, with or without notice. We will not be liable to you or any third party for any such modification, suspension, or discontinuation.

        14.2 Changes to These Terms
        We may revise these Terms of Service at any time by updating this document on our website. Changes take effect immediately upon posting. We will:
        - Update the "Last Updated" date at the top of this page.
        - Notify registered customers of material changes via email.

        Your continued use of our website following the posting of changes constitutes your acceptance of the revised Terms of Service.

        15. Governing Law & Dispute Resolution

        15.1 Governing Law
        These Terms of Service shall be governed by and construed in accordance with the laws of Nepal, without regard to its conflict of law provisions.

        15.2 Dispute Resolution
        In the event of any dispute, controversy, or claim arising from these Terms of Service or your use of our website, the parties agree to first attempt to resolve the matter informally by contacting Candy Station at support@candystation.com.np. If informal resolution is not achieved within 30 days, the dispute shall be subject to the exclusive jurisdiction of the competent courts of Nepal.

        16. Severability & Waiver

        If any provision of these Terms of Service is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect. Candy Station's failure to enforce any right or provision of these Terms of Service shall not constitute a waiver of that right or provision.

        17. Contact Information

        If you have any questions, concerns, or feedback about these Terms of Service, please contact us:

        Candy Station
        Website: https://candystation.com.np
        Email: support@candystation.com.np
        Support Hours: Sunday – Friday, 9:00 AM – 6:00 PM (NPT)
        Location: Nepal

        Thank you for choosing Candy Station! By continuing to use our website, you acknowledge that you have read, understood, and accepted these Terms of Service.
        """;

    private const string ReturnRefundPolicyText = """
        Effective Date: September 2026

        At Candy Station, your satisfaction is our top priority. We take great care in packing and delivering every order, but if something isn't right, we're here to make it better. Please read our Return and Refund Policy carefully before making a purchase.

        1. Eligibility Criteria

        To be eligible for a refund or replacement, your request must meet all of the following conditions:
        - Your return request must be submitted within 24 hours of purchase.
        - Any damage or packaging issues must be reported within 24 hours of receiving your order.
        - The issue must be due to product damage (e.g., broken, melted, or crushed items) or packaging defects upon arrival.
        - The item(s) must be purchased directly through the Candy Station website (candystation.com.np).
        - Photographic or video evidence of the damaged product or packaging must be provided at the time of the request.
        - The order must be associated with a valid order confirmation email or Candy Station account.

        Resolution options:
        - Full Refund — for requests within 24 hrs of purchase. Delivery charge not included.
        - Replacement Item — for damage or packaging issues reported within 24 hrs of receiving the order. Delivery charge not included.

        2. Refund & Replacement Process

        If you believe your order qualifies for a refund or replacement, please follow these steps:

        Step 1 — Contact us within 24 hours. For a refund, reach out within 24 hours of purchase. For damage or packaging issues, report within 24 hours of receiving your order. Contact us via email (see Section 4).
        Step 2 — Provide your order details. Share your order number, the name used during checkout, and the date of purchase so we can locate your order quickly.
        Step 3 — Submit evidence. Attach clear photos or a short video showing the damaged product or packaging issue. Evidence is required to process your request.
        Step 4 — Choose your resolution. Let us know whether you prefer: (A) a full refund, credited to your original payment method, excluding delivery charge; or (B) a replacement, a new item sent to you, excluding delivery charge.
        Step 5 — Confirmation & processing. Once reviewed and approved, we confirm your resolution within 1–2 business days. Refunds are credited back within 2–3 business days.

        3. Exceptions & Exclusions

        The following situations are NOT eligible for a refund or replacement:
        - Return requests submitted more than 24 hours after purchase.
        - Damage or packaging issues reported more than 24 hours after receiving the order.
        - Delivery charges — these are non-refundable in all cases, including approved refund or replacement requests.
        - Change of mind — if you no longer want the product after placing the order.
        - Products that have been partially or fully consumed before raising a complaint.
        - Damage caused by customer mishandling of the package after delivery.
        - Items purchased during promotional or clearance sales, unless they arrive damaged.
        - Orders not placed through the official Candy Station website (candystation.com.np).

        4. Contact Information

        Our customer support team is ready to help. To initiate a return, refund, or replacement request, please reach out through any of the channels below:

        Website: https://candystation.com.np
        Email Support: support@candystation.com.np
        Support Hours: Sunday – Friday, 9:00 AM – 6:00 PM (NPT)
        Response Time: We aim to respond to all queries within 24 hours on business days.

        Thank you for choosing Candy Station! We value your trust and are committed to ensuring every order brings you joy. This policy is subject to change — please visit our website for the most up-to-date version.
        """;

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
                Slug = System.Text.RegularExpressions.Regex.Replace(name.ToLowerInvariant(), @"[^a-z0-9]+", "-").Trim('-'),
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
            PrivacyPolicy = PrivacyPolicyText,
            TermsOfService = TermsOfServiceText,
            ReturnRefundPolicy = ReturnRefundPolicyText,
            FacebookUrl = "https://www.facebook.com/people/Candy-Station/61593505918247/",
            InstagramUrl = "https://www.instagram.com/candy_station_ktm",
            TiktokUrl = "https://www.tiktok.com/@candy_.station",
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
