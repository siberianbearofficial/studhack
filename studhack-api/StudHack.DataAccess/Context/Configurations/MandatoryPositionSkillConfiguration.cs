using Eventity.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eventity.DataAccess.Configurations;

public class MandatoryPositionSkillConfiguration : IEntityTypeConfiguration<MandatoryPositionSkillDb>
{
    public void Configure(EntityTypeBuilder<MandatoryPositionSkillDb> builder)
    {
        builder.HasKey(mps => new { mps.MandatoryPositionId, mps.SkillId });

        builder.HasOne(mps => mps.MandatoryPosition)
            .WithMany(mp => mp.MandatoryPositionSkills)
            .HasForeignKey(mps => mps.MandatoryPositionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(mps => mps.Skill)
            .WithMany(s => s.MandatoryPositionSkills)
            .HasForeignKey(mps => mps.SkillId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
