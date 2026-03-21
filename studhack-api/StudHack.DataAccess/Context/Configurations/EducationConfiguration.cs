using StudHack.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace StudHack.DataAccess.Configurations;

public class EducationConfiguration : IEntityTypeConfiguration<EducationDb>
{
    public void Configure(EntityTypeBuilder<EducationDb> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .ValueGeneratedNever();

        builder.HasOne(e => e.User)
            .WithMany(u => u.Educations)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.University)
            .WithMany(u => u.Educations)
            .HasForeignKey(e => e.UniversityId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
