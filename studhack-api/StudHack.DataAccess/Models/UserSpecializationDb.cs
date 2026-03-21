using System.ComponentModel.DataAnnotations;

namespace Eventity.DataAccess.Models;

public class UserSpecializationDb
{
    internal UserSpecializationDb() { }

    public UserSpecializationDb(Guid userId, Guid specializationId)
    {
        UserId = userId;
        SpecializationId = specializationId;
    }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public Guid SpecializationId { get; set; }

    public virtual UserDb User { get; set; }
    public virtual SpecializationDb Specialization { get; set; }
}