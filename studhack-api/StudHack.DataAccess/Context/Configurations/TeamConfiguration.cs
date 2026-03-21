using Eventity.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eventity.DataAccess.Configurations;

public class TeamConfiguration : IEntityTypeConfiguration<TeamDb>
{
    public void Configure(EntityTypeBuilder<TeamDb> builder)
    {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id)
            .ValueGeneratedNever();

        builder.HasOne(t => t.Hackaton)
            .WithMany(h => h.Teams)
            .HasForeignKey(t => t.HackatonId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(t => t.Captain)
            .WithMany(u => u.CaptainTeams)
            .HasForeignKey(t => t.CaptainId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(t => t.Creator)
            .WithMany(u => u.CreatedTeams)
            .HasForeignKey(t => t.CreatorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(t => t.TeamPositions)
            .WithOne(tp => tp.Team)
            .HasForeignKey(tp => tp.TeamId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
