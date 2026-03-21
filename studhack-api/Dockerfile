FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["StudHack.Api/StudHack.Api.csproj", "StudHack.Api/"]
COPY ["StudHack.Application/StudHack.Application.csproj", "StudHack.Application/"]
COPY ["StudHack.Domain/StudHack.Domain.csproj", "StudHack.Domain/"]
COPY ["StudHack.DataAccess/StudHack.DataAccess.csproj", "StudHack.DataAccess/"]
RUN dotnet restore "StudHack.Api/StudHack.Api.csproj"
COPY . .
WORKDIR "/src/StudHack.Api"
RUN dotnet build "./StudHack.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./StudHack.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_HTTP_PORTS=8081;3000
ENTRYPOINT ["dotnet", "StudHack.Api.dll"]
EXPOSE 3000
