using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudHack.Domain.Models;

public class MessageToSend
{
    internal MessageToSend() { }

    public MessageToSend(Guid subscriptionId, Guid eventDateId, string message, string userEmail)
    {
        SubscriptionId = subscriptionId;
        EventDateId = eventDateId;
        Message = message;
        UserEmail = userEmail;
    }

    public Guid SubscriptionId { get; init; }
    public Guid EventDateId { get; init; }
    public string Message { get; init; }
    public string UserEmail { get; init; }
}
