using StudHack.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace StudHack.DataAccess.Configurations;

public class SubscriptionConfiguration : IEntityTypeConfiguration<SubscriptionDb>
{
    public void Configure(EntityTypeBuilder<SubscriptionDb> builder)
    {
        builder.HasKey(s => s.Id);

        builder.HasOne(s => s.Event)
            .WithMany(e => e.Subscriptions)
            .HasForeignKey(s => s.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(s => s.User)
            .WithMany(u => u.Subscriptions)
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
