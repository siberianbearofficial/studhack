using System.ComponentModel.DataAnnotations;

namespace StudHack.DataAccess.Models;

public class SpecializationDb
{
    internal SpecializationDb() { }

    public SpecializationDb(Guid id, string name)
    {
        Id = id;
        Name = name;
    }

    public Guid Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; }

    public virtual ICollection<UserSpecializationDb> UserSpecializations { get; set; } = new List<UserSpecializationDb>();
    public virtual ICollection<MandatoryPositionDb> MandatoryPositions { get; set; } = new List<MandatoryPositionDb>();
    public virtual ICollection<AdditionalPositionDataDb> AdditionalPositionDataItems { get; set; } = new List<AdditionalPositionDataDb>();
}