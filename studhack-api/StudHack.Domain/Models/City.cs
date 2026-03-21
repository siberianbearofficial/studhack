using System.ComponentModel.DataAnnotations;

namespace StudHack.Domain.Models;

public class City
{
    internal City() { }

    public City(Guid id, string name, Region region)
    {
        Id = id;
        Name = name;
        Region = region;
    }

    public Guid Id { get; }

    [Required]
    [StringLength(100)]
    public string Name { get; }

    [Required]
    public Region Region { get; }
}