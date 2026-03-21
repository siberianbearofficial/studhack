using System.ComponentModel.DataAnnotations;

namespace StudHack.Domain.Models;

public class MandatoryPositionData
{
    internal MandatoryPositionData() { }

    public MandatoryPositionData(Guid id, Guid hackatonId, Guid specializationId, IEnumerable<Skill>? skills = null)
    {
        Id = id;
        HackatonId = hackatonId;
        SpecializationId = specializationId;
        Skills = skills ?? Array.Empty<Skill>();
    }

    public Guid Id { get; init; }

    [Required]
    public Guid HackatonId { get; init; }

    [Required]
    public Guid SpecializationId { get; init; }
    
    public IEnumerable<Skill> Skills { get; init; }
}