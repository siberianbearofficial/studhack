using Eventity.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eventity.DataAccess.Configurations;

public class HackatonConfiguration : IEntityTypeConfiguration<HackatonDb>
{
    public void Configure(EntityTypeBuilder<HackatonDb> builder)
    {
        builder.HasKey(h => h.Id);

        builder.Property(h => h.Id)
            .ValueGeneratedNever();

        builder.HasIndex(h => h.EventId)
            .IsUnique();

        builder.HasOne(h => h.Event)
            .WithOne(e => e.Hackaton)
            .HasForeignKey<HackatonDb>(h => h.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(h => h.Teams)
            .WithOne(t => t.Hackaton)
            .HasForeignKey(t => t.HackatonId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(h => h.MandatoryPositions)
            .WithOne(mp => mp.Hackaton)
            .HasForeignKey(mp => mp.HackatonId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
