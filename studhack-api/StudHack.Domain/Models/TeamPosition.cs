using System.ComponentModel.DataAnnotations;
using StudHack.Domain;

namespace StudHack.Domain.Models;

public class TeamPosition
{
    internal TeamPosition() { }

    public TeamPosition(
        Guid id,
        Guid teamId,
        bool filledByExternal,
        TeamPositionType type,
        Guid? userId,
        AdditionalPositionData? additionalPositionData,
        MandatoryPositionData? mandatoryPositionData)
    {
        Id = id;
        TeamId = teamId;
        FilledByExternal = filledByExternal;
        Type = type;
        UserId = userId;
        AddPositionData = additionalPositionData; //TODO
        MandPositionData = mandatoryPositionData;
    }

    public Guid Id { get; init; }

    [Required]
    public Guid TeamId { get; init; }

    [Required]
    public bool FilledByExternal { get; init; }

    [Required]
    public TeamPositionType Type { get; init; }

    public Guid? UserId { get; init; }

    public AdditionalPositionData? AddPositionData { get; init; }

    public MandatoryPositionData? MandPositionData { get; init; }
}