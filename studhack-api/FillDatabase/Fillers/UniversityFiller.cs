using HtmlAgilityPack;
using Microsoft.Extensions.Logging;
using StudHack.Domain.Abstractions.Repositories;
using StudHack.Domain.Interfaces.Repositories;
using StudHack.Domain.Models;

namespace FillDatabase.Fillers;

public class UniversityFiller(
    ICityRepository cityRepository,
    IUniversityRepository universityRepository,
    ILogger<UniversityFiller> logger) : IFiller
{
    private record ParsedUniversity(string Name, string? City);

    private async Task<List<ParsedUniversity>> ParseUniversitiesAsync(string url)
    {
        using var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Add("User-Agent",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");

        var html = await httpClient.GetStringAsync(url);
        return ParseUniversitiesFromHtml(html);
    }

    // Технические/технологические профили для фильтрации
    private static readonly HashSet<string> TechnicalProfiles = new HashSet<string>
    {
        "Технический и технологический",
        "Архитектуры и строительства",
        "Инженерный",
        "Технологический",
        "IT"
    };

    private static bool IsTechnicalUniversity(List<string> profiles)
    {
        if (profiles == null || profiles.Count == 0)
            return false;

        // Проверяем наличие хотя бы одного технического профиля
        return profiles.Any(p => TechnicalProfiles.Contains(p) ||
                                 p.Contains("технич", StringComparison.OrdinalIgnoreCase) ||
                                 p.Contains("технолог", StringComparison.OrdinalIgnoreCase) ||
                                 p.Contains("инженер", StringComparison.OrdinalIgnoreCase) ||
                                 p.Contains("архитектур", StringComparison.OrdinalIgnoreCase));
    }

    private List<ParsedUniversity> ParseUniversitiesFromHtml(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var universities = new List<ParsedUniversity>();

        // Находим все элементы с классом "org" (каждый вуз)
        var orgNodes = doc.DocumentNode.SelectNodes("//li[contains(@class, 'org')]");

        if (orgNodes == null)
            return universities;

        foreach (var orgNode in orgNodes)
        {
            // Находим ссылку с названием вуза
            var nameNode = orgNode.SelectSingleNode(".//div[contains(@class, 'info')]/a");
            var name = nameNode?.InnerText?.Trim();

            // Находим город/локацию
            var locationNode = orgNode.SelectSingleNode(".//div[contains(@class, 'location')]");
            string city = null;

            if (locationNode != null)
            {
                var locationText = locationNode.InnerText?.Trim();

                // Парсим город из строки типа "г. Москва" или "Свердловская область, г. Екатеринбург"
                city = ParseCity(locationText);
            }

            var profiles = new List<string>();
            var profileNodes = orgNode.SelectNodes(".//div[contains(@class, 'profiles')]/span");

            if (profileNodes != null)
            {
                foreach (var profileNode in profileNodes)
                {
                    var profile = profileNode.InnerText?.Trim();
                    if (!string.IsNullOrEmpty(profile))
                    {
                        profiles.Add(profile);
                    }
                }
            }

            if (!string.IsNullOrEmpty(name) && IsTechnicalUniversity(profiles))
            {
                universities.Add(new ParsedUniversity(name, city));
            }
        }

        return universities;
    }

    private static string? ParseCity(string locationText)
    {
        if (string.IsNullOrEmpty(locationText))
            return null;

        // Вариант 1: "г. Москва"
        if (locationText.Contains("г."))
        {
            var parts = locationText.Split(',');
            foreach (var part in parts)
            {
                var trimmed = part.Trim();
                if (trimmed.StartsWith("г."))
                {
                    return trimmed.Replace("г.", "").Trim();
                }
            }
        }

        // Вариант 2: город указан после запятой
        var lastCommaIndex = locationText.LastIndexOf(',');
        if (lastCommaIndex >= 0)
        {
            var possibleCity = locationText.Substring(lastCommaIndex + 1).Trim();
            if (possibleCity.StartsWith("г."))
                return possibleCity.Replace("г.", "").Trim();
            return possibleCity;
        }

        return locationText;
    }

    public async Task FillAsync()
    {
        var cities = (await cityRepository.GetAllAsync()).ToList();
        var existing = (await universityRepository.GetAllAsync())
            .Select(e => e.Name)
            .ToHashSet();

        for (int page = 1; page <= 107; page++)
        {
            string url =
                $"https://moeobrazovanie.ru/search.php?operation=show_result&section=vuz&region_id=777&page={page}";
            logger.LogInformation($"Парсинг страницы {page}...");

            var universities = await ParseUniversitiesAsync(url);
            foreach (var university in universities.Where(e => !existing.Contains(e.Name)))
            {
                var city = cities.FirstOrDefault(e => e.Name == university.City);
                if (city != null)
                    await universityRepository.AddAsync(new University(Guid.NewGuid(),
                        university.Name.Length > 200 ? university.Name.Substring(0, 200) : university.Name, city));
                else
                    logger.LogInformation($"Пропускаем '{university.Name}': город '{university.City}' не найден");
            }

            // Небольшая задержка между запросами
            await Task.Delay(1000);
        }
    }
}