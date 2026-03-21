using StudHack.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace StudHack.DataAccess.Configurations;

public class UserSkillConfiguration : IEntityTypeConfiguration<UserSkillDb>
{
    public void Configure(EntityTypeBuilder<UserSkillDb> builder)
    {
        builder.HasKey(us => new { us.UserId, us.SkillId });

        builder.HasOne(us => us.User)
            .WithMany(u => u.UserSkills)
            .HasForeignKey(us => us.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(us => us.Skill)
            .WithMany(s => s.UserSkills)
            .HasForeignKey(us => us.SkillId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
