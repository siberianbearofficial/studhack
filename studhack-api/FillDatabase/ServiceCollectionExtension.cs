using FillDatabase.Fillers;
using Microsoft.Extensions.DependencyInjection;

namespace FillDatabase;

public static class ServiceCollectionExtension
{
    public static IServiceCollection AddDatabaseFillers(this IServiceCollection services)
    {
        services.AddScoped<IFiller, CitiesFiller>();
        services.AddScoped<IFiller, UniversityFiller>();
        services.AddScoped<IFiller, SkillsFiller>();
        services.AddScoped<IFiller, SpecializationsFiller>();
        services.AddScoped<IFiller, EventsFiller>();
        return services;
    }
}
