using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StudHack.Core.Abstractions;
using StudHack.Core.Abstractions.Repositories;
using StudHack.Domain.Models;

namespace StudHack.MessageSenderService;

public class MessageSenderService(
    IServiceScopeFactory scopeFactory,
    IOptions<BackgroundServiceOptions> options) : BaseBackgroundService(scopeFactory, options)
{
    protected override async Task ProcessAsync(CancellationToken stoppingToken)
    {
        await ExecuteInScopeAsync(async (serviceProvider, ct) =>
        {
            var notificationsRepo = serviceProvider.GetRequiredService<INotificationsRepository>();
            var emailSender = serviceProvider.GetRequiredService<IMessageSender>();

            List<MessageToSend> emails = await notificationsRepo.GetMessagesToSend();
            List<MessageToSend> sent_emails = [];

            foreach (var email in emails)
            {
                try
                {
                    await emailSender.Send(email.UserEmail, "Уведомление", email.Message);
                    sent_emails.Add(email);
                }
                catch (Exception ex)
                {

                }
            }
            await notificationsRepo.MarkSent(sent_emails);
        }, stoppingToken);
    }
}