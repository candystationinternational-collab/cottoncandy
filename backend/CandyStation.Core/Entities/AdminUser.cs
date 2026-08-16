using CandyStation.Core.Enums;

namespace CandyStation.Core.Entities;

public class AdminUser
{
    public int Id { get; set; }
    public string Username { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string? DisplayName { get; set; }
    public bool IsActive { get; set; } = true;
    public StaffRole Role { get; set; } = StaffRole.Admin;
}
