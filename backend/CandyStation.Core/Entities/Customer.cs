namespace CandyStation.Core.Entities;

public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string? Phone { get; set; }
    public string PasswordHash { get; set; } = "";
    public DateTime JoinedDate { get; set; } = DateTime.UtcNow;
    public int OrdersCount { get; set; }
    public decimal TotalSpent { get; set; }

    public bool IsEmailVerified { get; set; }
    public string? EmailVerificationToken { get; set; }
    public DateTime? EmailVerificationTokenExpiresAt { get; set; }

    public List<CustomerAddress> Addresses { get; set; } = [];
}

public class CustomerAddress
{
    public int Id { get; set; }
    public int? CustomerId { get; set; } // null for guest-checkout addresses
    public Customer? Customer { get; set; }

    public string? Label { get; set; }
    public string Name { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Address1 { get; set; } = "";
    public string? Address2 { get; set; }
    public string City { get; set; } = "";
    public string State { get; set; } = "";
    public string PostalCode { get; set; } = "";
    public string Country { get; set; } = "Nepal";
}
