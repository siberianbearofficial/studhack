using System.ComponentModel.DataAnnotations;
using StudHack.DataAccess;

namespace Eventity.DataAccess.Models;

public class EducationDb
{
    internal EducationDb() { }

    public EducationDb(
        Guid id,
        Guid userId,
        Guid universityId,
        EducationDegree degree,
        string? faculty,
        int yearStart,
        int yearEnd)
    {
        Id = id;
        UserId = userId;
        UniversityId = universityId;
        Degree = degree;
        Faculty = faculty;
        YearStart = yearStart;
        YearEnd = yearEnd;
    }

    public Guid Id { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public Guid UniversityId { get; set; }

    [Required]
    public EducationDegree Degree { get; set; }

    [StringLength(200)]
    public string? Faculty { get; set; }

    [Required]
    public int YearStart { get; set; }

    [Required]
    public int YearEnd { get; set; }

    public virtual UserDb User { get; set; }
    public virtual UniversityDb University { get; set; }
}