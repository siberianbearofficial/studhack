using StudHack.Api.Dtos;
using StudHack.Domain.Models;

namespace StudHack.Api.Extensions;

public static class SentMessageConverter
{
    public static SentMessageDto ToDto(this SentMessage sm)
    {
        return new SentMessageDto
        {
            IdEventDate = sm.IdEventDate,
            IdSubscription = sm.IdSubscription,
            Message = sm.Message
        };
    }

    public static SentMessage ToDomain(this SentMessageDto dto)
    {
        return new SentMessage(dto.IdEventDate, dto.IdSubscription, dto.Message);
    }
}