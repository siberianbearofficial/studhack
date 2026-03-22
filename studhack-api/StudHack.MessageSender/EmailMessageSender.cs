using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using StudHack.Core.Abstractions;

namespace Studhack.MessageSender;

public class EmailMessageSender(IConfiguration config) : IMessageSender
{
    private readonly IConfigurationSection _config = config.GetSection("Smtp");
    public async Task Send(string address, string subject, string message)
    {
        using var client = new SmtpClient();
        client.Host = _config["Host"]!;
        client.Port = int.Parse(_config["Port"]!);
        client.UseDefaultCredentials = _config.GetValue<bool>("UseDefaultCredentials");
        client.EnableSsl = _config.GetValue<bool>("EnableSsl");
        client.DeliveryMethod = SmtpDeliveryMethod.Network;
        client.Credentials = client.UseDefaultCredentials ? null :
            new NetworkCredential(_config["User"]!, _config["Password"]!);

        var mail = new MailMessage(_config["SmtpEmail"]!, address, subject, message)
        { IsBodyHtml = false };

        await client.SendMailAsync(mail).ConfigureAwait(false);
        mail.Dispose();
    }
}
