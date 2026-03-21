using StudHack.DataAccess.Configurations;
using StudHack.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace StudHack.DataAccess.Context;

public class StudHackDbContext : DbContext
{
    public virtual DbSet<UserDb> Users { get; set; }
    public virtual DbSet<EventDb> Events { get; set; }
    public virtual DbSet<HackatonDb> Hackatons { get; set; }
    public virtual DbSet<TeamDb> Teams { get; set; }
    public virtual DbSet<TeamPositionDb> TeamPositions { get; set; }
    public virtual DbSet<TeamRequestDb> TeamRequests { get; set; }
    public virtual DbSet<EventDateDb> EventDates { get; set; }
    public virtual DbSet<SubscriptionDb> Subscriptions { get; set; }
    public virtual DbSet<RegionDb> Regions { get; set; }
    public virtual DbSet<CityDb> Cities { get; set; }
    public virtual DbSet<UniversityDb> Universities { get; set; }
    public virtual DbSet<EducationDb> Educations { get; set; }
    public virtual DbSet<SpecializationDb> Specializations { get; set; }
    public virtual DbSet<SkillDb> Skills { get; set; }
    public virtual DbSet<UserSkillDb> UserSkills { get; set; }
    public virtual DbSet<UserSpecializationDb> UserSpecializations { get; set; }
    public virtual DbSet<PortfolioLinkDb> PortfolioLinks { get; set; }
    public virtual DbSet<MandatoryPositionDb> MandatoryPositions { get; set; }
    public virtual DbSet<MandatoryPositionSkillDb> MandatoryPositionSkills { get; set; }
    public virtual DbSet<AdditionalPositionDataDb> AdditionalPositionDataItems { get; set; }
    public virtual DbSet<AdditionalPositionSkillDb> AdditionalPositionSkills { get; set; }

    public StudHackDbContext(DbContextOptions<StudHackDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(StudHackDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }
}
