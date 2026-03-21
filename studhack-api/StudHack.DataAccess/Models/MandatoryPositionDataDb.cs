using System.ComponentModel.DataAnnotations;

namespace StudHack.DataAccess.Models;

public class MandatoryPositionDb
{
    internal MandatoryPositionDb() { }

    public MandatoryPositionDb(Guid id, Guid hackatonId, Guid specializationId)
    {
        Id = id;
        HackatonId = hackatonId;
        SpecializationId = specializationId;
    }

    public Guid Id { get; set; }

    [Required]
    public Guid HackatonId { get; set; }

    [Required]
    public Guid SpecializationId { get; set; }

    public virtual HackatonDb Hackaton { get; set; }
    public virtual SpecializationDb Specialization { get; set; }

    public virtual ICollection<MandatoryPositionSkillDb> MandatoryPositionSkills { get; set; } = new List<MandatoryPositionSkillDb>();
    public virtual ICollection<TeamPositionDb> TeamPositions { get; set; } = new List<TeamPositionDb>();
}