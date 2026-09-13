namespace CandyStation.Core.Enums;

public enum OrderStatus
{
    Pending,
    Confirmed,
    Preparing,
    OutForDelivery,
    Delivered,
    Cancelled,
}

public enum DeliveryMethod
{
    Delivery,
    Pickup,
}

public enum ItemStatus
{
    Active,
    Inactive,
}

/// <summary>Staff role stored on AdminUser. Admin has full CRUD access; Delivery is
/// order-status-and-print only (no product/category/bundle/customer/settings edit rights).</summary>
public enum StaffRole
{
    Admin,
    Delivery,
}

/// <summary>What a HeroSlide links to — exactly one of the slide's Product/Bundle FKs is set to match.</summary>
public enum HeroItemType
{
    Product,
    Bundle,
}
