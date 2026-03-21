using System.ComponentModel.DataAnnotations;

namespace Eventity.DataAccess.Models;

public class MandatoryPositionSkillDb
{
    internal MandatoryPositionSkillDb() { }

    public MandatoryPositionSkillDb(Guid mandatoryPositionId, Guid skillId)
    {
        MandatoryPositionId = mandatoryPositionId;
        SkillId = skillId;
    }

    [Required]
    public Guid MandatoryPositionId { get; set; }

    [Required]
    public Guid SkillId { get; set; }

    public virtual MandatoryPositionDb MandatoryPosition { get; set; }
    public virtual SkillDb Skill { get; set; }
}