using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace CandyStation.Api.Auth;

public class JwtTokenService(IConfiguration config)
{
    public string CreateToken(int userId, string email, string name, string role)
    {
        var jwt = config.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new(ClaimTypes.Email, email),
            new(ClaimTypes.Name, name),
            new(ClaimTypes.Role, role),
        };

        var token = new JwtSecurityToken(
            issuer: jwt["Issuer"],
            audience: jwt["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(double.Parse(jwt["ExpiryMinutes"]!)),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
