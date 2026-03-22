using System.ComponentModel.DataAnnotations;
using StudHack.Domain.Enums;

namespace StudHack.Domain.Models;

public class Skill
{
    internal Skill() { }

    public Skill(Guid id, string name)
    {
        Id = id;
        Name = name;
    }

    public Guid Id { get; }

    [Required]
    [StringLength(100)]
    public string Name { get; }
}