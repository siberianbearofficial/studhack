using System.ComponentModel.DataAnnotations;

namespace Eventity.Domain.Models;

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
        Guid authId)
    {
        Id = id;
        UniqueName = uniqueName;
        DisplayedName = displayedName;
        BirthDate = birthDate;
        Available = available;
        CityOfResidenceId = cityOfResidenceId;
        MainSpecializationId = mainSpecializationId;
        AuthId = authId;
    }

    public Guid Id { get; }

    [Required]
    [StringLength(100)]
    public string UniqueName { get; }

    [Required]
    [StringLength(100)]
    public string DisplayedName { get; }

    [Required]
    public DateTime BirthDate { get; }

    [Required]
    public bool Available { get; }

    public Guid? CityOfResidenceId { get; }

    public Guid? MainSpecializationId { get; }

    [StringLength(500)]
    public string? AvatarUrl { get; }

    [Required]
    public Guid AuthId { get; }

    [EmailAddress]
    [StringLength(255)]
    public string? Email { get; }

    public string? Biography { get; }

    [Required]
    public DateTime CreatedAt { get; }

    [Required]
    public DateTime UpdatedAt { get; }
    
    public City? City { get; init; }

    [Required]
    public IEnumerable<UserSkill> UserSkills { get; init; }
    
    [Required]
    public IEnumerable<UserSpecialization> UserSpecializations { get; init; }
    
    [Required]
    public IEnumerable<PortfolioLink> PortfolioLinks { get; init; }
    
    [Required]
    public IEnumerable<Education> Educations { get; init; }

    [Required] public IEnumerable<Subscription> Subscriptions { get; init; }

    [Required]
    public IEnumerable<TeamRequest> TeamRequests { get; init; }
    
    [Required]
    public IEnumerable<Team> CaptainTeams { get; init; }
    
    [Required]
    public IEnumerable<Team> CreatedTeams { get; init; }
    
    [Required]
    public IEnumerable<TeamPosition> TeamPositions { get; init; }
}
