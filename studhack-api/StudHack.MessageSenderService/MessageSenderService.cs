using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StudHack.Domain;
using StudHack.Domain.Models;

namespace StudHack.MessageSenderService;

public class MessageSenderService : BaseBackgroundService
{
    public EmailBackgroundService(
        IServiceScopeFactory scopeFactory,
        IOptions<BackgroundServiceOptions> options)
        : base(scopeFactory, options)
    {
        _logger = logger;
    }

    protected override async Task ProcessAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Email processing started at: {time}", DateTimeOffset.Now);

        await ExecuteInScopeAsync(async (serviceProvider, ct) =>
        {
            var emailQueue = serviceProvider.GetRequiredService<IEmailQueue>();
            var emailSender = serviceProvider.GetRequiredService<IMessageSender>();
            var logger = serviceProvider.GetRequiredService<ILogger<EmailBackgroundService>>();

            var emails = await emailQueue.GetPendingEmailsAsync(ct);

            foreach (var email in emails)
            {
                try
                {
                    await emailSender.Send(email.Address, email.Subject, email.Message);
                    await emailQueue.MarkAsSentAsync(email.Id, ct);
                    logger.LogInformation("Email sent to {Address}", email.Address);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Failed to send email to {Address}", email.Address);
                    await emailQueue.MarkAsFailedAsync(email.Id, ex.Message, ct);
                }
            }
        }, stoppingToken);

        _logger.LogInformation("Email processing completed at: {time}", DateTimeOffset.Now);
    }
}