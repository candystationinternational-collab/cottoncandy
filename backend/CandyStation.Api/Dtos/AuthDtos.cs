namespace CandyStation.Api.Dtos;

public record RegisterRequest(string Name, string Email, string? Phone, string Password);
public record LoginRequest(string Email, string Password);
public record AdminLoginRequest(string Username, string Password);

public record AuthResponse(string Token, string Name, string Email);
public record RegisterResponse(string Email, string Message);
public record ResendVerificationRequest(string Email);
public record VerifyEmailRequest(string Token);
public record ForgotPasswordRequest(string Email);
public record ResetPasswordRequest(string Token, string NewPassword);
public record AdminAuthResponse(string Token, string Username, string? DisplayName, string Role);

public record AddressDto(
    int Id,
    string? Label,
    string Name,
    string Phone,
    string Address1,
    string? Address2,
    string City,
    string State,
    string PostalCode,
    string Country
);

public record CustomerMeDto(string Name, string Email, string? Phone, List<AddressDto> Addresses);

public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
