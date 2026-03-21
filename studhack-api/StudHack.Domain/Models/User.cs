using System.ComponentModel.DataAnnotations;

namespace StudHack.Domain.Models;

public class User
{
    internal User() { }

    public User(
        Guid id,
        string uniqueName,
        string displayedName,
        DateTime birthDate,
        bool available,
        Guid? cityOfResidenceId,
        Guid? mainSpecializationId,
        Guid authId,
        string? avatarUrl,
        string? email,
        string? biography,
        DateTime createdAt,
        DateTime updatedAt,
        City? city,
        IEnumerable<Skill>? skills,
        IEnumerable<Specialization>? specializations,
        IEnumerable<PortfolioLink>? portfolioLinks,
        IEnumerable<Education>? educations)
    {
        Id = id;
        UniqueName = uniqueName;
        DisplayedName = displayedName;
        BirthDate = birthDate;
        Available = available;
        CityOfResidenceId = cityOfResidenceId;
        MainSpecializationId = mainSpecializationId;
        AuthId = authId;
        AvatarUrl = avatarUrl;
        Email = email;
        Biography = biography;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
        City = city;
        Skills = skills ?? Array.Empty<Skill>();
        Specializations = specializations ?? Array.Empty<Specialization>();
        PortfolioLinks = portfolioLinks ?? Array.Empty<PortfolioLink>();
        Educations = educations ?? Array.Empty<Education>();
    }

    public Guid Id { get; init;  }

    [Required]
    [StringLength(100)]
    public string UniqueName { get; init;  }

    [Required]
    [StringLength(100)]
    public string DisplayedName { get; init;  }

    [Required]
    public DateTime BirthDate { get; init;  }

    [Required]
    public bool Available { get; init; }

    public Guid? CityOfResidenceId { get; init; }

    public Guid? MainSpecializationId { get; init; }

    [StringLength(500)]
    public string? AvatarUrl { get; init; }

    [Required]
    public Guid AuthId { get; init; }

    [EmailAddress]
    [StringLength(255)]
    public string? Email { get; init; }

    public string? Biography { get; init; }

    [Required]
    public DateTime CreatedAt { get; init; }

    [Required]
    public DateTime UpdatedAt { get; init; }
    
    public City? City { get; init; }

    [Required]
    public IEnumerable<Skill> Skills { get; init; }
    
    [Required]
    public IEnumerable<Specialization> Specializations { get; init; }
    
    [Required]
    public IEnumerable<PortfolioLink> PortfolioLinks { get; init; }
    
    [Required]
    public IEnumerable<Education> Educations { get; init; }
}