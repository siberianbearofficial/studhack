using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using StudHack.Core.Abstractions;

namespace Studhack.MessageSender;

public class EmailMessageSender(IConfiguration config) : IMessageSender
{
    public async Task Send(string address, string subject, string message)
    {
        using var client = new SmtpClient();
        client.Host = config["Smtp:Host"]!;
        client.Port = int.Parse(config["Smtp:Port"]!);
        client.UseDefaultCredentials = config.GetValue<bool>("Smtp:UseDefaultCredentials");
        client.EnableSsl = config.GetValue<bool>("Smtp:EnableSsl");
        client.DeliveryMethod = SmtpDeliveryMethod.Network;
        client.Credentials = client.UseDefaultCredentials ? null :
            new NetworkCredential(config["Smtp:User"]!, config["Smtp:Password"]!);
        var mail = new MailMessage(config["Smtp:Email"]!, address, subject, message)
        { IsBodyHtml = false };
        await client.SendMailAsync(mail).ConfigureAwait(false);
        mail.Dispose();
    }
}
