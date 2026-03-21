using System.Reflection;
using System.Text.Json;
using StudHack.Domain.Interfaces.Repositories;
using StudHack.Domain.Models;

namespace FillDatabase.Fillers;

public class SkillsFiller(ISkillRepository skillRepository) : IFiller
{
    public async Task FillAsync()
    {
        var existing = (await skillRepository.GetAllAsync())
            .Select(e => e.Name)
            .ToHashSet();
        await using var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream("FillDatabase.Data.skills.json");
        if (stream == null)
            throw new FileNotFoundException();
        var skills = await JsonSerializer.DeserializeAsync<string[]>(stream) ?? [];
        foreach (var skill in skills.Where(e => !existing.Contains(e)))
        {
            await skillRepository.AddAsync(new Skill(Guid.NewGuid(), skill));
        }
    }
}