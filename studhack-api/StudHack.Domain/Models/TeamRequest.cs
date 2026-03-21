using System.ComponentModel.DataAnnotations;
using StudHack.Domain;

namespace StudHack.Domain.Models;

public class TeamRequest
{
    internal TeamRequest() { }

    public TeamRequest(
        Guid id,
        Guid teamPositionId,
        Guid userId,
        TeamRequestType type,
        TeamRequestStatus status,
        string? message,
        DateTime createdAt, 
        DateTime? resolvedAt)
    {
        Id = id;
        TeamPositionId = teamPositionId;
        UserId = userId;
        Type = type;
        Status = status;
        Message = message;
        CreatedAt = createdAt;
        ResolvedAt = resolvedAt;
    }

    public Guid Id { get; init; }

    [Required]
    public Guid TeamPositionId { get; init; }

    [Required]
    public Guid UserId { get; init; }

    public string? Message { get; init; }

    [Required]
    public TeamRequestType Type { get; init; }

    [Required]
    public TeamRequestStatus Status { get; init; }

    [Required]
    public DateTime CreatedAt { get; init; }

    public DateTime? ResolvedAt { get; init; }
}