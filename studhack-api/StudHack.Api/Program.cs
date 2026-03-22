using Avalux.Auth.ApiClient;
using FillDatabase;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StudHack.Application.Services;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Repositories;
using StudHack.Domain.Abstractions;
using StudHack.Domain.Abstractions.Repositories;
using StudHack.Domain.Interfaces.Repositories;
using StudHack.MessageSenderService;
using Studhack.MessageSender;
using StudHack.Core.Abstractions;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();
builder.Services.AddDbContext<StudHackDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration["ConnectionStrings.Postgres"]);
});

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICityRepository, CityRepository>();
builder.Services.AddScoped<IRegionRepository, RegionRepository>();
builder.Services.AddScoped<ISkillRepository, SkillRepository>();
builder.Services.AddScoped<ISpecializationRepository, SpecializationRepository>();
builder.Services.AddScoped<IUniversityRepository, UniversityRepository>();

/*
TODO в EmailMessageSender нужно перекинуть переменные SMTP из среды или хз откуда, формат такой:

set Smtp__Host=smtp.yandex.com
set Smtp__Port=587
set Smtp__User=studhackaton@yandex.ru
set Smtp__Email=studhackaton@yandex.ru
set Smtp__Password=<secret_password>
set Smtp__UseDefaultCredentials=false
set Smtp__EnableSsl=true
 */

builder.Services.AddScoped<IMessageSender, EmailMessageSender>();
builder.Services.Configure<BackgroundServiceOptions>(options =>
{
    options.Interval = TimeSpan.FromMinutes(60);
    options.ErrorDelay = TimeSpan.FromMinutes(1);
    options.Enabled = true;
    options.MaxRetryCount = 3;
});
builder.Services.AddHostedService<MessageSenderService>();


builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddDatabaseFillers();
builder.Services.AddAvaluxAuthApiClient(builder.Configuration["Auth.ApiUrl"] ?? "",
    builder.Configuration["Auth.ApiToken"] ?? "");

builder.Services.AddControllers();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
    {
        options.MetadataAddress =
            $"{builder.Configuration["Auth.ApiUrl"]}/api/v1/.well-known/openid-configuration";
        options.Authority = builder.Configuration["Auth.ApiUrl"];
        options.RequireHttpsMetadata = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Auth.Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Auth.Audience"],
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
        };

        options.RefreshInterval = TimeSpan.FromMinutes(30);
        options.RefreshOnIssuerKeyNotFound = true;
    });
builder.Services.AddAuthorizationBuilder()
    .AddDefaultPolicy("User", policy => policy.RequireClaim("UserId"));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(options => options
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseAuthorization();

app.MapControllers();

app.Run();