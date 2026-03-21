using StudHack.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace StudHack.DataAccess.Configurations;

public class UserSpecializationConfiguration : IEntityTypeConfiguration<UserSpecializationDb>
{
    public void Configure(EntityTypeBuilder<UserSpecializationDb> builder)
    {
        builder.HasKey(us => new { us.UserId, us.SpecializationId });

        builder.HasOne(us => us.User)
            .WithMany(u => u.UserSpecializations)
            .HasForeignKey(us => us.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(us => us.Specialization)
            .WithMany(s => s.UserSpecializations)
            .HasForeignKey(us => us.SpecializationId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
