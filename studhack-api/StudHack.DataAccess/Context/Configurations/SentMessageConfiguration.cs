using StudHack.DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace StudHack.DataAccess.Configurations;

public class SentMessageConfiguration : IEntityTypeConfiguration<SentMessageDb>
{
    public void Configure(EntityTypeBuilder<SentMessageDb> builder)
    {
        builder.HasKey(ed => new { ed.IdEventDate, ed.IdSubscription });
    }
}
