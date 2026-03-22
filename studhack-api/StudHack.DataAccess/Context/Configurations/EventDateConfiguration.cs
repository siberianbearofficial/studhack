using StudHack.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace StudHack.DataAccess.Configurations;

public class EventDateConfiguration : IEntityTypeConfiguration<EventDateDb>
{
    public void Configure(EntityTypeBuilder<EventDateDb> builder)
    {
        builder.HasKey(ed => ed.Id);

        builder.HasOne(ed => ed.Event)
            .WithMany(e => e.EventDates)
            .HasForeignKey(ed => ed.EventId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
