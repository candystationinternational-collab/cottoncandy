using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace CandyStation.Api.Email;

/// <summary>
/// Sends transactional email via SMTP relay (configured here for Brevo's smtp-relay.brevo.com:587,
/// but works with any SMTP-AUTH relay) using MailKit — the modern, actively maintained replacement
/// for the deprecated System.Net.Mail.SmtpClient, which has known STARTTLS/AUTH negotiation issues
/// with some providers. Configure Smtp:Host/Port/Username/Password in appsettings / user-secrets —
/// never commit real credentials to source control.
/// </summary>
public class SmtpEmailService(IConfiguration config, ILogger<SmtpEmailService> logger) : IEmailService
{
    public async Task SendAsync(string toEmail, string toName, string subject, string htmlBody)
    {
        var host = config["Smtp:Host"];
        var portRaw = config["Smtp:Port"];
        var username = config["Smtp:Username"];
        var password = config["Smtp:Password"];
        var senderEmail = config["Smtp:SenderEmail"] ?? "no-reply@candystation.com.np";
        var senderName = config["Smtp:SenderName"] ?? "Candy Station";

        if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
        {
            logger.LogWarning("SMTP is not configured — skipping email send to {Email} (subject: {Subject}). " +
                "Set Smtp:Host/Port/Username/Password to enable real sending.", toEmail, subject);
            return;
        }

        var port = int.TryParse(portRaw, out var p) ? p : 587;

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(senderName, senderEmail));
        message.To.Add(new MailboxAddress(toName, toEmail));
        message.Subject = subject;
        message.Body = new BodyBuilder { HtmlBody = htmlBody }.ToMessageBody();

        try
        {
            using var client = new SmtpClient();
            await client.ConnectAsync(host, port, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(username, password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
            // Email delivery failures must never break the request that triggered them (registration, order creation, etc).
            logger.LogError(ex, "SMTP email send failed for {Email}", toEmail);
        }
    }
}
