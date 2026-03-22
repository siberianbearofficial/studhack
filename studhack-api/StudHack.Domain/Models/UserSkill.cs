using System.ComponentModel.DataAnnotations;
using StudHack.Domain.Enums;

namespace StudHack.Domain.Models;

public class UserSkill : Skill
{
    public UserSkill(Guid id, string name, ExperienceLevel level) : base(id, name)
    {
        Level = level;
    }

    [Required] public ExperienceLevel Level { get; }
}