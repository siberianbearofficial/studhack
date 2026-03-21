using StudHack.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace StudHack.DataAccess.Configurations;

public class PortfolioLinkConfiguration : IEntityTypeConfiguration<PortfolioLinkDb>
{
    public void Configure(EntityTypeBuilder<PortfolioLinkDb> builder)
    {
        builder.HasKey(pl => pl.Id);

        builder.Property(pl => pl.Id)
            .ValueGeneratedNever();

        builder.HasOne(pl => pl.User)
            .WithMany(u => u.PortfolioLinks)
            .HasForeignKey(pl => pl.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
