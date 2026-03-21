using StudHack.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace StudHack.DataAccess.Configurations;

public class UniversityConfiguration : IEntityTypeConfiguration<UniversityDb>
{
    public void Configure(EntityTypeBuilder<UniversityDb> builder)
    {
        builder.HasKey(u => u.Id);

        builder.Property(u => u.Id)
            .ValueGeneratedNever();

        builder.HasOne(u => u.City)
            .WithMany(c => c.Universities)
            .HasForeignKey(u => u.CityId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(u => u.Educations)
            .WithOne(e => e.University)
            .HasForeignKey(e => e.UniversityId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
