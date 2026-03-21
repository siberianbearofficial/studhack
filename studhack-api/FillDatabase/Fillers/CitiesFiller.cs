using System.Net.Http.Json;
using FillDatabase.Models;
using StudHack.Domain.Abstractions.Repositories;
using StudHack.Domain.Interfaces.Repositories;
using StudHack.Domain.Models;

namespace FillDatabase.Fillers;

public class CitiesFiller(ICityRepository cityRepository, IRegionRepository regionRepository) : IFiller
{
    private readonly HttpClient _httpClient = new();

    private async Task<CityModel[]> LoadCities()
    {
        var resp = await _httpClient.GetFromJsonAsync<CityModel[]>(
            "https://raw.githubusercontent.com/pensnarik/russian-cities/refs/heads/master/russian-cities.json");
        return resp ?? [];
    }

    public async Task FillAsync()
    {
        var regions = (await regionRepository.GetAllAsync())
            .ToDictionary(e => e.Name);
        var existing = (await cityRepository.GetAllAsync())
            .Select(e => e.Name)
            .ToHashSet();
        foreach (var city in await LoadCities())
        {
            if (existing.Contains(city.Name))
                continue;
            if (!regions.ContainsKey(city.Subject))
            {
                var region = new Region(Guid.NewGuid(), city.Subject);
                await regionRepository.AddAsync(region);
                regions.Add(city.Subject, region);
            }

            await cityRepository.AddAsync(new City(Guid.NewGuid(), city.Name, regions[city.Subject]));
        }
    }
}