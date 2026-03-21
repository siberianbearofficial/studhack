using System.ComponentModel.DataAnnotations;

namespace StudHack.DataAccess.Models;

public class CityDb
{
    internal CityDb() { }

    public CityDb(Guid id, string name, Guid regionId)
    {
        Id = id;
        Name = name;
        RegionId = regionId;
    }

    public Guid Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; }

    [Required]
    public Guid RegionId { get; set; }

    public virtual RegionDb Region { get; set; }

    public virtual ICollection<UserDb> Users { get; set; } = new List<UserDb>();
    public virtual ICollection<EventDb> Events { get; set; } = new List<EventDb>();
    public virtual ICollection<UniversityDb> Universities { get; set; } = new List<UniversityDb>();
}