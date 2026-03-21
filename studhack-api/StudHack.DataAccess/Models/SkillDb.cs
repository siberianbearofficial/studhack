using System.ComponentModel.DataAnnotations;

namespace StudHack.DataAccess.Models;

public class SkillDb
{
    internal SkillDb() { }

    public SkillDb(Guid id, string name)
    {
        Id = id;
        Name = name;
    }

    public Guid Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; }

    public virtual ICollection<UserSkillDb> UserSkills { get; set; } = new List<UserSkillDb>();
    public virtual ICollection<MandatoryPositionSkillDb> MandatoryPositionSkills { get; set; } = new List<MandatoryPositionSkillDb>();
    public virtual ICollection<AdditionalPositionSkillDb> AdditionalPositionSkills { get; set; } = new List<AdditionalPositionSkillDb>();
}