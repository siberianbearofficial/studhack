using StudHack.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace StudHack.DataAccess.Configurations;

public class CityConfiguration : IEntityTypeConfiguration<CityDb>
{
    public void Configure(EntityTypeBuilder<CityDb> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id)
            .ValueGeneratedNever();

        builder.HasOne(c => c.Region)
            .WithMany(r => r.Cities)
            .HasForeignKey(c => c.RegionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(c => c.Universities)
            .WithOne(u => u.City)
            .HasForeignKey(u => u.CityId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(c => c.Events)
            .WithOne(e => e.City)
            .HasForeignKey(e => e.CityId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(c => c.Users)
            .WithOne(u => u.CityOfResidence)
            .HasForeignKey(u => u.CityOfResidenceId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
