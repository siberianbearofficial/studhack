using System.ComponentModel.DataAnnotations;

namespace StudHack.Domain.Models;

public class University
{
    internal University() { }

    public University(Guid id, string name, City city)
    {
        Id = id;
        Name = name;
        City = city;
    }

    public Guid Id { get; }

    [Required]
    [StringLength(200)]
    public string Name { get; }

    [Required]
    public City City { get; }
}