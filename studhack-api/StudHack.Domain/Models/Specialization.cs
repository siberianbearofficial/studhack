using System.ComponentModel.DataAnnotations;

namespace Eventity.Domain.Models;

public class Specialization
{
    internal Specialization() { }

    public Specialization(Guid id, string name)
    {
        Id = id;
        Name = name;
    }

    public Guid Id { get; }

    [Required]
    [StringLength(100)]
    public string Name { get; }
}