namespace CandyStation.Api.Dtos;

public record StaffUserDto(int Id, string Username, string? DisplayName, string Role, bool IsActive);
public record StaffCreateDto(string Username, string Password, string? DisplayName, string Role);
public record StaffUpdateDto(string? DisplayName, string Role, bool IsActive);
public record StaffResetPasswordDto(string NewPassword);
