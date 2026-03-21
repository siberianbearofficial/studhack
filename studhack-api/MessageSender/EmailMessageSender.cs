using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;

namespace MessageSender;

public interface IMessageSender
{
    Task Send(string address, string subject, string message);
}

public class EmailMessageSender(IConfiguration config) : IMessageSender
{
    public async Task Send(string address, string subject, string message)
    {
        using var client = new SmtpClient();
        client.Host = config["SMTP:Host"]!;
        client.Port = int.Parse(config["SMTP:Port"]!);
        client.UseDefaultCredentials = config.GetValue<bool>("SMTP:UseDefaultCredentials");
        client.EnableSsl = config.GetValue<bool>("SMTP:EnableSsl");
        client.DeliveryMethod = SmtpDeliveryMethod.Network;
        client.Credentials = client.UseDefaultCredentials ? null :
            new NetworkCredential(config["SMTP:User"]!, config["SMTP:Password"]!);

        var mail = new MailMessage(config["Smtp:Email"]!, address, subject, message)
        { IsBodyHtml = false };

        await client.SendMailAsync(mail).ConfigureAwait(false);
        mail.Dispose();
    }
}
