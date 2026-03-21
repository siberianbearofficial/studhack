using Avalux.Auth.ApiClient;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StudHack.Application.Services;
using StudHack.DataAccess.Context;
using StudHack.DataAccess.Repositories;
using StudHack.Domain.Abstractions;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();
builder.Services.AddDbContext<StudHackDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration["ConnectionStrings.Postgres"]);
});

builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddAvaluxAuthApiClient(builder.Configuration["Auth.ApiUrl"] ?? "",
    builder.Configuration["Auth.ApiToken"] ?? "");

builder.Services.AddControllers();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
    {
        options.MetadataAddress =
            $"{builder.Configuration["Auth.Issuer"]}/.well-known/openid-configuration";
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