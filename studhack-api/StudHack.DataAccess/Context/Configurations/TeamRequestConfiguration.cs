using StudHack.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace StudHack.DataAccess.Configurations;

public class TeamRequestConfiguration : IEntityTypeConfiguration<TeamRequestDb>
{
    public void Configure(EntityTypeBuilder<TeamRequestDb> builder)
    {
        builder.HasKey(tr => tr.Id);

        builder.Property(tr => tr.Id)
            .ValueGeneratedNever();

        builder.HasOne(tr => tr.TeamPosition)
            .WithMany(tp => tp.TeamRequests)
            .HasForeignKey(tr => tr.TeamPositionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(tr => tr.User)
            .WithMany(u => u.TeamRequests)
            .HasForeignKey(tr => tr.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
