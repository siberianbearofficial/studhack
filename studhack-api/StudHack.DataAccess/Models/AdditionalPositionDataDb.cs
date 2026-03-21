using System.ComponentModel.DataAnnotations;

namespace Eventity.DataAccess.Models;

public class AdditionalPositionDataDb
{
    internal AdditionalPositionDataDb() { }

    public AdditionalPositionDataDb(Guid id, Guid specializationId)
    {
        Id = id;
        SpecializationId = specializationId;
    }

    public Guid Id { get; set; }

    [Required]
    public Guid SpecializationId { get; set; }

    public virtual SpecializationDb Specialization { get; set; }

    public virtual ICollection<AdditionalPositionSkillDb> AdditionalPositionSkills { get; set; } = new List<AdditionalPositionSkillDb>();
    public virtual ICollection<TeamPositionDb> TeamPositions { get; set; } = new List<TeamPositionDb>();
}