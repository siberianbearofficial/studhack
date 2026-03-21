using System.ComponentModel.DataAnnotations;
using StudHack.DataAccess;

namespace StudHack.DataAccess.Models;

public class UserSkillDb
{
    internal UserSkillDb() { }

    public UserSkillDb(Guid userId, Guid skillId, ExperienceLevelDb experienceLevel)
    {
        UserId = userId;
        SkillId = skillId;
        ExperienceLevel = experienceLevel;
    }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public Guid SkillId { get; set; }

    [Required]
    public ExperienceLevelDb ExperienceLevel { get; set; }

    public virtual UserDb User { get; set; }
    public virtual SkillDb Skill { get; set; }
}