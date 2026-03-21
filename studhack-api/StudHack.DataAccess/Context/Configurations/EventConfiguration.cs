using System;
using StudHack.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace StudHack.DataAccess.Configurations;

public class EventConfiguration : IEntityTypeConfiguration<EventDb>
{
    public void Configure(EntityTypeBuilder<EventDb> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .ValueGeneratedNever();

        builder.HasOne(e => e.City)
            .WithMany(c => c.Events)
            .HasForeignKey(e => e.CityId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Hackaton)
            .WithOne(h => h.Event)
            .HasForeignKey<HackatonDb>(h => h.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.EventDates)
            .WithOne(d => d.Event)
            .HasForeignKey(d => d.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.Subscriptions)
            .WithOne(s => s.Event)
            .HasForeignKey(s => s.EventId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
