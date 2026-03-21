using System.ComponentModel.DataAnnotations;

namespace StudHack.Domain.Models;

public class City
{
    internal City() { }

    public City(Guid id, string name, Guid regionId)
    {
        Id = id;
        Name = name;
        RegionId = regionId;
    }

    public Guid Id { get; }

    [Required]
    [StringLength(100)]
    public string Name { get; }

    [Required]
    public Guid RegionId { get; }
}