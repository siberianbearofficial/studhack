using Eventity.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eventity.DataAccess.Configurations;

public class SkillConfiguration : IEntityTypeConfiguration<SkillDb>
{
    public void Configure(EntityTypeBuilder<SkillDb> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Id)
            .ValueGeneratedNever();
    }
}
