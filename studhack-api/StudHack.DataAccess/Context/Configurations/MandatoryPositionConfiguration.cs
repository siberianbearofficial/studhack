using Eventity.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eventity.DataAccess.Configurations;

public class MandatoryPositionConfiguration : IEntityTypeConfiguration<MandatoryPositionDb>
{
    public void Configure(EntityTypeBuilder<MandatoryPositionDb> builder)
    {
        builder.HasKey(mp => mp.Id);

        builder.Property(mp => mp.Id)
            .ValueGeneratedNever();

        builder.HasOne(mp => mp.Hackaton)
            .WithMany(h => h.MandatoryPositions)
            .HasForeignKey(mp => mp.HackatonId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(mp => mp.Specialization)
            .WithMany(s => s.MandatoryPositions)
            .HasForeignKey(mp => mp.SpecializationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(mp => mp.MandatoryPositionSkills)
            .WithOne(mps => mps.MandatoryPosition)
            .HasForeignKey(mps => mps.MandatoryPositionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(mp => mp.TeamPositions)
            .WithOne(tp => tp.MandatoryPositionData)
            .HasForeignKey(tp => tp.MandatoryPositionDataId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
