using CandyStation.Api.Auth;
using CandyStation.Api.Dtos;
using CandyStation.Api.Email;
using CandyStation.Core.Entities;
using CandyStation.Core.Enums;
using CandyStation.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CandyStation.Api.Services;

public class DuplicateEmailException : Exception;
public class InvalidCredentialsException : Exception;
public class EmailNotVerifiedException : Exception;
public class InvalidOrExpiredTokenException : Exception;
public class CustomerNotFoundException : Exception;

public class AuthService(CandyStationDbContext db, JwtTokenService tokens, IEmailService email, IConfiguration config)
{
    private readonly PasswordHasher<Customer> _hasher = new();

    private static string NewToken() => Convert.ToHexString(System.Security.Cryptography.RandomNumberGenerator.GetBytes(32));

    private string VerifyUrl(string token) =>
        $"{(config["App:FrontendBaseUrl"] ?? "http://localhost:3000").TrimEnd('/')}/verify-email?token={token}";

    public async Task<RegisterResponse> RegisterAsync(RegisterRequest req)
    {
        if (await db.Customers.AnyAsync(c => c.Email == req.Email))
            throw new DuplicateEmailException();

        var customer = new Customer
        {
            Name = req.Name,
            Email = req.Email,
            Phone = req.Phone,
            PasswordHash = "",
            IsEmailVerified = false,
            EmailVerificationToken = NewToken(),
            EmailVerificationTokenExpiresAt = DateTime.UtcNow.AddHours(24),
        };
        customer.PasswordHash = _hasher.HashPassword(customer, req.Password);
        db.Customers.Add(customer);
        await db.SaveChangesAsync();

        var (subject, html) = EmailTemplates.VerifyEmail(customer.Name, VerifyUrl(customer.EmailVerificationToken!));
        await email.SendAsync(customer.Email, customer.Name, subject, html);

        return new RegisterResponse(customer.Email, "Account created. Please check your email to verify your account before logging in.");
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest req)
    {
        var customer = await db.Customers.FirstOrDefaultAsync(c => c.Email == req.Email);
        if (customer is null) throw new InvalidCredentialsException();

        var result = _hasher.VerifyHashedPassword(customer, customer.PasswordHash, req.Password);
        if (result == PasswordVerificationResult.Failed) throw new InvalidCredentialsException();
        if (!customer.IsEmailVerified) throw new EmailNotVerifiedException();

        var token = tokens.CreateToken(customer.Id, customer.Email, customer.Name, "Customer");
        return new AuthResponse(token, customer.Name, customer.Email);
    }

    public async Task<AuthResponse> VerifyEmailAsync(string token)
    {
        var customer = await db.Customers.FirstOrDefaultAsync(c => c.EmailVerificationToken == token);
        if (customer is null || customer.EmailVerificationTokenExpiresAt < DateTime.UtcNow)
            throw new InvalidOrExpiredTokenException();

        customer.IsEmailVerified = true;
        customer.EmailVerificationToken = null;
        customer.EmailVerificationTokenExpiresAt = null;
        await db.SaveChangesAsync();

        var jwt = tokens.CreateToken(customer.Id, customer.Email, customer.Name, "Customer");
        return new AuthResponse(jwt, customer.Name, customer.Email);
    }

    public async Task ResendVerificationAsync(string emailAddress)
    {
        var customer = await db.Customers.FirstOrDefaultAsync(c => c.Email == emailAddress);
        if (customer is null) throw new CustomerNotFoundException();
        if (customer.IsEmailVerified) return; // already verified — nothing to resend

        customer.EmailVerificationToken = NewToken();
        customer.EmailVerificationTokenExpiresAt = DateTime.UtcNow.AddHours(24);
        await db.SaveChangesAsync();

        var (subject, html) = EmailTemplates.VerifyEmail(customer.Name, VerifyUrl(customer.EmailVerificationToken));
        await email.SendAsync(customer.Email, customer.Name, subject, html);
    }

    public async Task<CustomerMeDto?> GetMeAsync(int customerId)
    {
        var c = await db.Customers.Include(x => x.Addresses).FirstOrDefaultAsync(x => x.Id == customerId);
        if (c is null) return null;
        return new CustomerMeDto(c.Name, c.Email, c.Phone,
            c.Addresses.Select(a => new AddressDto(a.Id, a.Label, a.Name, a.Phone, a.Address1, a.Address2, a.City, a.State, a.PostalCode, a.Country)).ToList());
    }
}

public class AdminAuthService(CandyStationDbContext db, JwtTokenService tokens)
{
    private readonly PasswordHasher<AdminUser> _hasher = new();

    public async Task<AdminAuthResponse> LoginAsync(AdminLoginRequest req)
    {
        var admin = await db.AdminUsers.FirstOrDefaultAsync(a => a.Username == req.Username && a.IsActive);
        if (admin is null) throw new InvalidCredentialsException();

        var result = _hasher.VerifyHashedPassword(admin, admin.PasswordHash, req.Password);
        if (result == PasswordVerificationResult.Failed) throw new InvalidCredentialsException();

        var token = tokens.CreateToken(admin.Id, admin.Username, admin.DisplayName ?? admin.Username, admin.Role.ToString());
        return new AdminAuthResponse(token, admin.Username, admin.DisplayName, admin.Role.ToString());
    }

    public async Task ChangePasswordAsync(int adminId, ChangePasswordRequest req)
    {
        var admin = await db.AdminUsers.FirstOrDefaultAsync(a => a.Id == adminId) ?? throw new InvalidCredentialsException();
        var check = _hasher.VerifyHashedPassword(admin, admin.PasswordHash, req.CurrentPassword);
        if (check == PasswordVerificationResult.Failed) throw new InvalidCredentialsException();
        admin.PasswordHash = _hasher.HashPassword(admin, req.NewPassword);
        await db.SaveChangesAsync();
    }

    private static StaffUserDto ToDto(AdminUser u) => new(u.Id, u.Username, u.DisplayName, u.Role.ToString(), u.IsActive);

    public async Task<List<StaffUserDto>> GetStaffAsync() =>
        (await db.AdminUsers.OrderBy(a => a.Username).ToListAsync()).Select(ToDto).ToList();

    public async Task<StaffUserDto> CreateStaffAsync(StaffCreateDto req)
    {
        if (await db.AdminUsers.AnyAsync(a => a.Username == req.Username))
            throw new DuplicateEmailException();

        var role = Enum.TryParse<StaffRole>(req.Role, ignoreCase: true, out var r) ? r : StaffRole.Delivery;
        var user = new AdminUser { Username = req.Username, DisplayName = req.DisplayName, Role = role };
        user.PasswordHash = _hasher.HashPassword(user, req.Password);
        db.AdminUsers.Add(user);
        await db.SaveChangesAsync();
        return ToDto(user);
    }

    public async Task<StaffUserDto> UpdateStaffAsync(int id, StaffUpdateDto req)
    {
        var user = await db.AdminUsers.FindAsync(id) ?? throw new InvalidCredentialsException();
        user.DisplayName = req.DisplayName;
        user.Role = Enum.TryParse<StaffRole>(req.Role, ignoreCase: true, out var r) ? r : user.Role;
        user.IsActive = req.IsActive;
        await db.SaveChangesAsync();
        return ToDto(user);
    }

    public async Task ResetStaffPasswordAsync(int id, StaffResetPasswordDto req)
    {
        var user = await db.AdminUsers.FindAsync(id) ?? throw new InvalidCredentialsException();
        user.PasswordHash = _hasher.HashPassword(user, req.NewPassword);
        await db.SaveChangesAsync();
    }

    public async Task DeleteStaffAsync(int id)
    {
        var user = await db.AdminUsers.FindAsync(id) ?? throw new InvalidCredentialsException();
        db.AdminUsers.Remove(user);
        await db.SaveChangesAsync();
    }
}
