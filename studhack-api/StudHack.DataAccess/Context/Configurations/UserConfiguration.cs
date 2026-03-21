using StudHack.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace StudHack.DataAccess.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<UserDb>
{
    public void Configure(EntityTypeBuilder<UserDb> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .ValueGeneratedNever();

        builder.HasIndex(e => e.UniqueName)
            .IsUnique();

        builder.HasIndex(e => e.AuthId)
            .IsUnique();

        builder.HasOne(e => e.CityOfResidence)
            .WithMany(c => c.Users)
            .HasForeignKey(e => e.CityOfResidenceId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(e => e.UserSkills)
            .WithOne(us => us.User)
            .HasForeignKey(us => us.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.UserSpecializations)
            .WithOne(us => us.User)
            .HasForeignKey(us => us.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.PortfolioLinks)
            .WithOne(pl => pl.User)
            .HasForeignKey(pl => pl.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.Educations)
            .WithOne(ed => ed.User)
            .HasForeignKey(ed => ed.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.Subscriptions)
            .WithOne(s => s.User)
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.TeamRequests)
            .WithOne(tr => tr.User)
            .HasForeignKey(tr => tr.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(e => e.CaptainTeams)
            .WithOne(t => t.Captain)
            .HasForeignKey(t => t.CaptainId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(e => e.CreatedTeams)
            .WithOne(t => t.Creator)
            .HasForeignKey(t => t.CreatorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(e => e.TeamPositions)
            .WithOne(tp => tp.User)
            .HasForeignKey(tp => tp.UserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

