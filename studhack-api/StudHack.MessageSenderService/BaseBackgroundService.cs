using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace StudHack.MessageSenderService;

public class BackgroundServiceOptions
{
    public TimeSpan Interval { get; set; } = TimeSpan.FromSeconds(30);
    public TimeSpan ErrorDelay { get; set; } = TimeSpan.FromSeconds(60);
    public bool Enabled { get; set; } = true;
    public int MaxRetryCount { get; set; } = 3;
}

public abstract class BaseBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly BackgroundServiceOptions _options;

    protected BaseBackgroundService(
        IServiceScopeFactory scopeFactory,
        IOptions<BackgroundServiceOptions> options)
    {
        _scopeFactory = scopeFactory;
        _options = options.Value;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessAsync(stoppingToken);

                await Task.Delay(_options.Interval, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                await Task.Delay(_options.ErrorDelay, stoppingToken);
            }
        }

    }

    protected abstract Task ProcessAsync(CancellationToken stoppingToken);

    protected async Task ExecuteInScopeAsync(
        Func<IServiceProvider, CancellationToken, Task> action,
        CancellationToken stoppingToken)
    {
        using var scope = _scopeFactory.CreateScope();
        await action(scope.ServiceProvider, stoppingToken);
    }
}