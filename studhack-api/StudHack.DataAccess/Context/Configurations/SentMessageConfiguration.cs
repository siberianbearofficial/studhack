using StudHack.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace StudHack.DataAccess.Configurations;

public class SentMessageConfiguration : IEntityTypeConfiguration<SentMessageDb>
{
    public void Configure(EntityTypeBuilder<SentMessageDb> builder)
    {
        builder.HasKey(sm => new { sm.IdEventDate, sm.IdSubscription });

        builder.HasOne(sm => sm.EventDate)
            .WithMany(ed => ed.SentMessages)
            .HasForeignKey(sm => sm.IdEventDate)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired(true);

        builder.HasOne(sm => sm.Subscription)
            .WithMany(s => s.SentMessages)
            .HasForeignKey(sm => sm.IdSubscription)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired(true);
    }
}
