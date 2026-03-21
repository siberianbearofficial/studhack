using StudHack.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace StudHack.DataAccess.Configurations;

public class AdditionalPositionSkillConfiguration : IEntityTypeConfiguration<AdditionalPositionSkillDb>
{
    public void Configure(EntityTypeBuilder<AdditionalPositionSkillDb> builder)
    {
        builder.HasKey(aps => new { aps.AdditionalPositionDataId, aps.SkillId });

        builder.HasOne(aps => aps.AdditionalPositionData)
            .WithMany(ap => ap.AdditionalPositionSkills)
            .HasForeignKey(aps => aps.AdditionalPositionDataId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(aps => aps.Skill)
            .WithMany(s => s.AdditionalPositionSkills)
            .HasForeignKey(aps => aps.SkillId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
