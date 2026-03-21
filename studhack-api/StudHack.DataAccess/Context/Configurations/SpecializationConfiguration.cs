using Eventity.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Eventity.DataAccess.Configurations;

public class SpecializationConfiguration : IEntityTypeConfiguration<SpecializationDb>
{
    public void Configure(EntityTypeBuilder<SpecializationDb> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Id)
            .ValueGeneratedNever();
    }
}
