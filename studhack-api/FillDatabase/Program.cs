// See https://aka.ms/new-console-template for more information

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using StudHack.DataAccess.Context;

var services = new ServiceCollection();

services.AddDbContext<StudHackDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration["ConnectionStrings.Postgres"]);
});