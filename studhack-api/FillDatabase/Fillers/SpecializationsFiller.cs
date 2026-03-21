using System.Reflection;
using System.Text.Json;
using StudHack.Domain.Interfaces.Repositories;
using StudHack.Domain.Models;

namespace FillDatabase.Fillers;

public class SpecializationsFiller(ISpecializationRepository specializationRepository) : IFiller
{
    public async Task FillAsync()
    {
        var existing = (await specializationRepository.GetAllAsync())
            .Select(e => e.Name)
            .ToHashSet();
        await using var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream("FillDatabase.Data.specializations.json");
        if (stream == null)
            throw new FileNotFoundException();
        var specializations = await JsonSerializer.DeserializeAsync<string[]>(stream) ?? [];
        foreach (var specialization in specializations.Where(e => !existing.Contains(e)))
        {
            await specializationRepository.AddAsync(new Specialization(Guid.NewGuid(), specialization));
        }
    }
}