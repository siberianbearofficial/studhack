namespace StudHack.Api.Dtos;

public class MandatoryCoverageDto
{
    public int Total { get; init; }
    public int Filled { get; init; }
    public bool AllFilled { get; init; }
}