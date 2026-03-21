using Eventity.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eventity.DataAccess.Configurations;

public class RegionConfiguration : IEntityTypeConfiguration<RegionDb>
{
    public void Configure(EntityTypeBuilder<RegionDb> builder)
    {
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Id)
            .ValueGeneratedNever();

        builder.HasMany(r => r.Cities)
            .WithOne(c => c.Region)
            .HasForeignKey(c => c.RegionId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
