namespace StudHack.Api.Dtos;

public class SentMessageDto
{
    public Guid IdEventDate { get; init; }
    public Guid IdSubscription { get; init; }
    public string Message { get; init; }
}

public class SentMessagesDto
{

    public IEnumerable<SentMessageDto> SentMessages { get; init; } = [];
}
