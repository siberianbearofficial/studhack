namespace StudHack.Api.Dtos;

public class DeleteResultDto
{
    public Guid Id { get; init; }
    public bool Deleted { get; init; } = true;
}