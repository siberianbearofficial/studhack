using System.ComponentModel.DataAnnotations;

namespace StudHack.Domain.Models;

public class University
{
    internal University() { }

    public University(Guid id, string name, Guid cityId)
    {
        Id = id;
        Name = name;
        CityId = cityId;
    }

    public Guid Id { get; }

    [Required]
    [StringLength(200)]
    public string Name { get; }

    [Required]
    public Guid CityId { get; }
}