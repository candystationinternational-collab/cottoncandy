namespace CandyStation.Api.Email;

/// <summary>Plain inline-styled HTML — no external CSS/images, so it renders consistently across email clients.</summary>
public static class EmailTemplates
{
    private const string Pink = "#F90264";
    private const string Navy = "#2D0A31";

    private static string Wrap(string title, string bodyHtml) => $"""
        <div style="font-family:Arial,Helvetica,sans-serif;background:#FFF8FB;padding:32px 16px;">
          <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:2px solid {Navy};">
            <div style="background:{Navy};padding:20px 24px;">
              <span style="color:#ffffff;font-weight:800;font-size:18px;">Candy Station</span>
            </div>
            <div style="padding:28px 24px;">
              <h1 style="margin:0 0 16px;color:{Navy};font-size:20px;">{title}</h1>
              {bodyHtml}
            </div>
            <div style="padding:16px 24px;background:#FFF4F8;color:#00000080;font-size:12px;">
              Candy Station · Kathmandu, Nepal
            </div>
          </div>
        </div>
        """;

    public static (string Subject, string Html) VerifyEmail(string name, string verifyUrl) => (
        "Verify your Candy Station account",
        Wrap("Welcome to Candy Station!",
            $"""
            <p style="color:#333;font-size:14px;line-height:1.6;">Hi {name},</p>
            <p style="color:#333;font-size:14px;line-height:1.6;">Thanks for signing up. Please verify your email to activate your account:</p>
            <p style="text-align:center;margin:24px 0;">
              <a href="{verifyUrl}" style="background:{Pink};color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:999px;font-weight:700;font-size:14px;display:inline-block;">Verify My Email</a>
            </p>
            <p style="color:#666;font-size:12px;">If the button doesn't work, copy this link into your browser: <br/>{verifyUrl}</p>
            <p style="color:#666;font-size:12px;">This link expires in 24 hours.</p>
            """)
    );

    public static (string Subject, string Html) OrderCreated(string name, string orderNumber, decimal total) => (
        $"Order Confirmed — {orderNumber}",
        Wrap("Order Confirmed! 🎉",
            $"""
            <p style="color:#333;font-size:14px;line-height:1.6;">Hi {name},</p>
            <p style="color:#333;font-size:14px;line-height:1.6;">Your order <strong>{orderNumber}</strong> has been placed successfully. Total: <strong>Rs. {total:N0}</strong>.</p>
            <p style="color:#333;font-size:14px;line-height:1.6;">We'll email you again when your order status changes. You can also track it anytime on our website.</p>
            """)
    );

    public static (string Subject, string Html) OrderStatusUpdate(string name, string orderNumber, string statusLabel) => (
        $"Order {orderNumber} — {statusLabel}",
        Wrap($"Your order is now: {statusLabel}",
            $"""
            <p style="color:#333;font-size:14px;line-height:1.6;">Hi {name},</p>
            <p style="color:#333;font-size:14px;line-height:1.6;">Your order <strong>{orderNumber}</strong> status has been updated to <strong>{statusLabel}</strong>.</p>
            """)
    );
}
