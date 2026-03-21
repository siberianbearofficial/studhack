using System.Reflection;
using System.Text.Json;
using StudHack.Domain.Interfaces.Repositories;
using StudHack.Domain.Models;

namespace FillDatabase.Fillers;

public class SkillsFiller(ISkillRepository skillRepository) : IFiller
{
    public async Task FillAsync()
    {
        await using var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream("FillDatabase.Data.skills.json");
        if (stream == null)
            throw new FileNotFoundException();
        var skills = await JsonSerializer.DeserializeAsync<string[]>(stream);
        foreach (var skill in skills ?? [])
        {
            await skillRepository.AddAsync(new Skill(Guid.NewGuid(), skill));
        }
    }
}