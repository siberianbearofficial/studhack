using Eventity.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eventity.DataAccess.Configurations;

public class TeamPositionConfiguration : IEntityTypeConfiguration<TeamPositionDb>
{
    public void Configure(EntityTypeBuilder<TeamPositionDb> builder)
    {
        builder.HasKey(tp => tp.Id);

        builder.Property(tp => tp.Id)
            .ValueGeneratedNever();

        builder.HasOne(tp => tp.Team)
            .WithMany(t => t.TeamPositions)
            .HasForeignKey(tp => tp.TeamId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(tp => tp.User)
            .WithMany(u => u.TeamPositions)
            .HasForeignKey(tp => tp.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(tp => tp.AdditionalPositionData)
            .WithMany(ap => ap.TeamPositions)
            .HasForeignKey(tp => tp.AdditionalPositionDataId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(tp => tp.MandatoryPositionData)
            .WithMany(mp => mp.TeamPositions)
            .HasForeignKey(tp => tp.MandatoryPositionDataId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(tp => tp.TeamRequests)
            .WithOne(tr => tr.TeamPosition)
            .HasForeignKey(tr => tr.TeamPositionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
