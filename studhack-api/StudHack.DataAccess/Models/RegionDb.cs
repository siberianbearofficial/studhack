using System.ComponentModel.DataAnnotations;

namespace StudHack.DataAccess.Models;

public class RegionDb
{
    internal RegionDb() { }

    public RegionDb(Guid id, string name)
    {
        Id = id;
        Name = name;
    }

    public Guid Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; }

    public virtual ICollection<CityDb> Cities { get; set; } = new List<CityDb>();
}