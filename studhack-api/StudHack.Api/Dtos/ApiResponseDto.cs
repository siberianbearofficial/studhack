using System.Diagnostics.CodeAnalysis;

namespace StudHack.Api.Dtos;

public class ApiResponseDto<T>
{
    [SetsRequiredMembers]
    public ApiResponseDto(T data)
    {
        Data = data;
    }

    [SetsRequiredMembers]
    public ApiResponseDto(T data, int total)
    {
        Data = data;
        Total = total;
    }

    public required T Data { get; init; }
    public int? Total { get; init; }
}