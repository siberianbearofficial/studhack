using System.Text.Json;
using System.Text.Json.Serialization;
using Avalux.Auth.ApiClient;
using FillDatabase;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Npgsql;
using StudHack.Application.Services;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Repositories;
using StudHack.Domain.Abstractions;
using StudHack.Domain.Abstractions.Repositories;
using StudHack.Domain.Interfaces.Repositories;
using StudHack.MessageSenderService;
using Studhack.MessageSender;
using StudHack.Core.Abstractions;
using StudHack.Core.Abstractions.Repositories;

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
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IEventDateRepository, EventDateRepository>();
builder.Services.AddScoped<IHackatonRepository, HackatonRepository>();
builder.Services.AddScoped<IMandatoryPositionRepository, MandatoryPositionRepository>();
builder.Services.AddScoped<IAdditionalPositionDataRepository, AdditionalPositionDataRepository>();
builder.Services.AddScoped<ITeamRepository, TeamRepository>();
builder.Services.AddScoped<ITeamPositionRepository, TeamPositionRepository>();
builder.Services.AddScoped<ITeamRequestRepository, TeamRequestRepository>();
builder.Services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
builder.Services.AddScoped<INotificationsRepository, NotificationsRepository>();

/*
TODO � EmailMessageSender ����� ���������� ���������� SMTP �� ����� ��� �� ������, ������ �����:

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
builder.Services.AddScoped<ITeamService, TeamService>();
builder.Services.AddScoped<ITeamRequestService, TeamRequestService>();

var authApiUrl =
    builder.Configuration["Auth.ApiUrl"] ??
    builder.Configuration["Auth:ApiUrl"];

if (string.IsNullOrWhiteSpace(authApiUrl))
{
    throw new InvalidOperationException(
        "Auth API url is missing. Configure 'Auth.ApiUrl' (or 'Auth:ApiUrl') in appsettings or environment variables.");
}

var authApiToken =
    builder.Configuration["Auth.ApiToken"] ??
    builder.Configuration["Auth:ApiToken"] ??
    builder.Configuration["AUTH_API_TOKEN"];

builder.Services.AddDatabaseFillers();
builder.Services.AddAvaluxAuthApiClient(authApiUrl, authApiToken ?? string.Empty);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    });

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
    {
        options.MetadataAddress =
            $"{authApiUrl}/api/v1/.well-known/openid-configuration";
        options.Authority = authApiUrl;
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
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        BearerFormat = "JWT"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();