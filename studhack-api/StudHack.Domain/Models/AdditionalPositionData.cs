using System.ComponentModel.DataAnnotations;

namespace StudHack.Domain.Models;

public class AdditionalPositionData
{
    internal AdditionalPositionData() { }

    public AdditionalPositionData(Guid id, Guid specializationId, IEnumerable<Skill>? skills = null)
    {
        Id = id;
        SpecializationId = specializationId;
        Skills = skills ?? Array.Empty<Skill>();
    }

    public Guid Id { get; init; }

    [Required]
    public Guid SpecializationId { get; init; }

    public IEnumerable<Skill> Skills { get; init; }
}