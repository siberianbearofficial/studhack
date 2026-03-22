// See https://aka.ms/new-console-template for more information

using FillDatabase;
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
services.AddScoped<ISkillRepository, SkillRepository>();
services.AddScoped<ISpecializationRepository, SpecializationRepository>();
services.AddScoped<IUniversityRepository, UniversityRepository>();
services.AddScoped<IEventRepository, EventRepository>();
services.AddScoped<IEventDateRepository, EventDateRepository>();
services.AddScoped<IHackatonRepository, HackatonRepository>();
services.AddScoped<IMandatoryPositionRepository, MandatoryPositionRepository>();

services.AddDatabaseFillers();

var serviceProvider = services.BuildServiceProvider();

using var scope = serviceProvider.CreateScope();

var fillers = scope.ServiceProvider.GetRequiredService<IEnumerable<IFiller>>();
foreach (var filler in fillers)
{
    await filler.FillAsync();
}
