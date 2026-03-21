namespace StudHack.Api.Dtos;

public class ApiResponseDto<T>
{
    public ApiResponseDto(T data)
    {
        Data = data;
    }

    public ApiResponseDto(T data, int total)
    {
        Data = data;
        Total = total;
    }

    public required T Data { get; init; }
    public int? Total { get; init; }
}