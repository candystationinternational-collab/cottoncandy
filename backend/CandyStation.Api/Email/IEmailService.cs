namespace CandyStation.Api.Email;

public interface IEmailService
{
    Task SendAsync(string toEmail, string toName, string subject, string htmlBody);
}
