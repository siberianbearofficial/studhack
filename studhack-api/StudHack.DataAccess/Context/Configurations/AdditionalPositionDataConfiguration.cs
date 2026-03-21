using Eventity.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eventity.DataAccess.Configurations;

public class AdditionalPositionDataConfiguration : IEntityTypeConfiguration<AdditionalPositionDataDb>
{
    public void Configure(EntityTypeBuilder<AdditionalPositionDataDb> builder)
    {
        builder.HasKey(ap => ap.Id);

        builder.Property(ap => ap.Id)
            .ValueGeneratedNever();

        builder.HasOne(ap => ap.Specialization)
            .WithMany(s => s.AdditionalPositionDataItems)
            .HasForeignKey(ap => ap.SpecializationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(ap => ap.AdditionalPositionSkills)
            .WithOne(aps => aps.AdditionalPositionData)
            .HasForeignKey(aps => aps.AdditionalPositionDataId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(ap => ap.TeamPositions)
            .WithOne(tp => tp.AdditionalPositionData)
            .HasForeignKey(tp => tp.AdditionalPositionDataId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
