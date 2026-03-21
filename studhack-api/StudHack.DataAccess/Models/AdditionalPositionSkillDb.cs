using System.ComponentModel.DataAnnotations;

namespace StudHack.DataAccess.Models;

public class AdditionalPositionSkillDb
{
    internal AdditionalPositionSkillDb() { }

    public AdditionalPositionSkillDb(Guid additionalPositionDataId, Guid skillId)
    {
        AdditionalPositionDataId = additionalPositionDataId;
        SkillId = skillId;
    }

    [Required]
    public Guid AdditionalPositionDataId { get; set; }

    [Required]
    public Guid SkillId { get; set; }

    public virtual AdditionalPositionDataDb AdditionalPositionData { get; set; }
    public virtual SkillDb Skill { get; set; }
}