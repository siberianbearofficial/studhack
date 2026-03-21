// See https://aka.ms/new-console-template for more information

using FillDatabase.Fillers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Repositories;
using StudHack.Domain.Abstractions.Repositories;
using StudHack.Domain.Interfaces.Repositories;

var services = new ServiceCollection();

services.AddDbContext<StudHackDbContext>(options =>
{
    options.UseNpgsql(Environment.GetEnvironmentVariable("DB_CONNECTION_STRING"));
});
services.AddLogging();

services.AddScoped<IRegionRepository, RegionRepository>();
services.AddScoped<ICityRepository, CityRepository>();

services.AddScoped<CitiesFiller>();

var serviceProvider = services.BuildServiceProvider();

using var scope = serviceProvider.CreateScope();
var citiesFiller = scope.ServiceProvider.GetRequiredService<CitiesFiller>();
await citiesFiller.FillAsync();