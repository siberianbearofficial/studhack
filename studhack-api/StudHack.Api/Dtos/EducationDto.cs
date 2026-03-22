using System.ComponentModel.DataAnnotations;
using System.Formats.Asn1;
using System.Text.Json.Serialization;
using StudHack.Api.Enums;

namespace StudHack.Api.Dtos;

public class EducationDto
{
    public Guid Id { get; set; }
    public required Guid UniversityId { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public EducationDegreeDto Degree { get; set; }
    [StringLength(200)] public string? Faculty { get; set; }
    public required int YearStart { get; set; }
    public required int YearEnd { get; set; }
}