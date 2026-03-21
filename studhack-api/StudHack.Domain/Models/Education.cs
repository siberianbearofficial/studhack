using System.ComponentModel.DataAnnotations;
using StudHack.DataAccess;

namespace Eventity.Domain.Models;

public class Education
{
    internal Education() { }

    public Education(
        Guid id,
        Guid userId,
        University university,
        EducationDegree degree,
        string? faculty,
        int yearStart,
        int yearEnd)
    {
        Id = id;
        UserId = userId;
        University = university;
        Degree = degree;
        Faculty = faculty;
        YearStart = yearStart;
        YearEnd = yearEnd;
    }

    public Guid Id { get; init; }

    [Required]
    public Guid UserId { get; init; }

    [Required]
    public University University { get; init; }

    [Required]
    public EducationDegree Degree { get; init; }

    [StringLength(200)]
    public string? Faculty { get; init; }

    [Required]
    public int YearStart { get; init; }

    [Required]
    public int YearEnd { get; init; }
}