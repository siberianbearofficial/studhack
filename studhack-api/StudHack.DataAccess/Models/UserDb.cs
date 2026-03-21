using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StudHack.DataAccess.Models;

public class UserDb
{
    internal UserDb() { }

    public UserDb(
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

    public Guid Id { get; set; }

    [Required]
    [StringLength(100)]
    public string UniqueName { get; set; }

    [Required]
    [StringLength(100)]
    public string DisplayedName { get; set; }

    [Required]
    public DateTime BirthDate { get; set; }

    [Required]
    public bool Available { get; set; }

    public Guid? CityOfResidenceId { get; set; }

    public Guid? MainSpecializationId { get; set; }

    [StringLength(500)]
    public string? AvatarUrl { get; set; }

    [Required]
    public Guid AuthId { get; set; }

    [EmailAddress]
    [StringLength(255)]
    public string? Email { get; set; }

    public string? Biography { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }

    [Required]
    public DateTime UpdatedAt { get; set; }

    public virtual CityDb? CityOfResidence { get; set; }

    public virtual ICollection<UserSkillDb> UserSkills { get; set; } = new List<UserSkillDb>();
    public virtual ICollection<UserSpecializationDb> UserSpecializations { get; set; } = new List<UserSpecializationDb>();
    public virtual ICollection<PortfolioLinkDb> PortfolioLinks { get; set; } = new List<PortfolioLinkDb>();
    public virtual ICollection<EducationDb> Educations { get; set; } = new List<EducationDb>();
    public virtual ICollection<SubscriptionDb> Subscriptions { get; set; } = new List<SubscriptionDb>();
    public virtual ICollection<TeamRequestDb> TeamRequests { get; set; } = new List<TeamRequestDb>();
    public virtual ICollection<TeamDb> CaptainTeams { get; set; } = new List<TeamDb>();
    public virtual ICollection<TeamDb> CreatedTeams { get; set; } = new List<TeamDb>();
    public virtual ICollection<TeamPositionDb> TeamPositions { get; set; } = new List<TeamPositionDb>();
}