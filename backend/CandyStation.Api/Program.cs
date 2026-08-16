using System.Text;
using CandyStation.Api.Auth;
using CandyStation.Api.Email;
using CandyStation.Api.Services;
using CandyStation.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Candy Station API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
    });
});

builder.Services.AddDbContext<CandyStationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<CatalogService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<AdminAuthService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<StatsService>();
builder.Services.AddScoped<IEmailService, SmtpEmailService>();

var jwtSection = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidateAudience = true,
            ValidAudience = jwtSection["Audience"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1),
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
        ?? ["http://localhost:3000"];
    options.AddPolicy("FrontendPolicy", policy =>
        policy.SetIsOriginAllowed(origin =>
                allowedOrigins.Contains(origin) ||
                origin.EndsWith(".vercel.app", StringComparison.OrdinalIgnoreCase)) // Vercel's production + preview-deploy domains
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<CandyStationDbContext>();
        db.Database.Migrate();
        DbInitializer.Seed(db);
    }
    catch (Exception ex)
    {
        // Don't let a bad/placeholder connection string take down the whole process — /health should
        // still respond so hosting-environment issues can be diagnosed separately from DB config issues.
        scope.ServiceProvider.GetRequiredService<ILogger<Program>>()
            .LogCritical(ex, "Database migration/seed failed at startup — check ConnectionStrings:Default.");
    }
}

app.UseExceptionHandler(errApp =>
{
    errApp.Run(async context =>
    {
        var feature = context.Features.Get<IExceptionHandlerFeature>();
        var problem = new ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Title = "An unexpected error occurred.",
            Detail = app.Environment.IsDevelopment() ? feature?.Error.Message : null,
            Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1",
        };
        context.Response.StatusCode = problem.Status.Value;
        context.Response.ContentType = "application/problem+json";
        await context.Response.WriteAsJsonAsync(problem);
    });
});

// Enabled in Production too (for now) so the hosted API can be exercised via /swagger while
// the site is being stood up — flip Swagger:Enabled to false in appsettings once launched for real.
if (app.Environment.IsDevelopment() || builder.Configuration.GetValue("Swagger:Enabled", false))
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("FrontendPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapControllers();

app.Run();

public partial class Program; // exposed for CandyStation.Tests (WebApplicationFactory-style access if needed)
