using System.ComponentModel.DataAnnotations;
using StudHack.DataAccess;

namespace StudHack.DataAccess.Models;

public class TeamRequestDb
{
    internal TeamRequestDb() { }

    public TeamRequestDb(
        Guid id,
        Guid teamPositionId,
        Guid userId,
        TeamRequestTypeDb type,
        TeamRequestStatusDb status,
        string? message)
    {
        Id = id;
        TeamPositionId = teamPositionId;
        UserId = userId;
        Type = type;
        Status = status;
        Message = message;
    }

    public Guid Id { get; set; }

    [Required]
    public Guid TeamPositionId { get; set; }

    [Required]
    public Guid UserId { get; set; }

    public string? Message { get; set; }

    [Required]
    public TeamRequestTypeDb Type { get; set; }

    [Required]
    public TeamRequestStatusDb Status { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }

    public DateTime? ResolvedAt { get; set; }

    public virtual TeamPositionDb TeamPosition { get; set; }
    public virtual UserDb User { get; set; }
}