using System.ComponentModel.DataAnnotations;
using StudHack.DataAccess;

namespace Eventity.DataAccess.Models;

public class TeamPositionDb
{
    internal TeamPositionDb() { }

    public TeamPositionDb(
        Guid id,
        Guid teamId,
        bool filledByExternal,
        TeamPositionType type,
        Guid? userId,
        Guid? additionalPositionDataId,
        Guid? mandatoryPositionDataId)
    {
        Id = id;
        TeamId = teamId;
        FilledByExternal = filledByExternal;
        Type = type;
        UserId = userId;
        AdditionalPositionDataId = additionalPositionDataId;
        MandatoryPositionDataId = mandatoryPositionDataId;
    }

    public Guid Id { get; set; }

    [Required]
    public Guid TeamId { get; set; }

    [Required]
    public bool FilledByExternal { get; set; }

    [Required]
    public TeamPositionType Type { get; set; }

    public Guid? UserId { get; set; }

    public Guid? AdditionalPositionDataId { get; set; }

    public Guid? MandatoryPositionDataId { get; set; }

    public virtual TeamDb Team { get; set; }
    public virtual UserDb? User { get; set; }
    public virtual AdditionalPositionDataDb? AdditionalPositionData { get; set; }
    public virtual MandatoryPositionDb? MandatoryPositionData { get; set; }

    public virtual ICollection<TeamRequestDb> TeamRequests { get; set; } = new List<TeamRequestDb>();
}