using System.ComponentModel.DataAnnotations;

namespace StudHack.DataAccess.Models;

public class UniversityDb
{
    internal UniversityDb() { }

    public UniversityDb(Guid id, string name, Guid cityId)
    {
        Id = id;
        Name = name;
        CityId = cityId;
    }

    public Guid Id { get; set; }

    [Required]
    [StringLength(200)]
    public string Name { get; set; }

    [Required]
    public Guid CityId { get; set; }

    public virtual CityDb City { get; set; }

    public virtual ICollection<EducationDb> Educations { get; set; } = new List<EducationDb>();
}