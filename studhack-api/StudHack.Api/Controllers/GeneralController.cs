using FillDatabase;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudHack.Api.Dtos;
using StudHack.Api.Extensions;
using StudHack.DataAccess.Context;
using StudHack.Domain.Abstractions.Repositories;
using StudHack.Domain.Abstractions;
using StudHack.Domain.Interfaces.Repositories;

namespace StudHack.Api.Controllers;

[ApiController]
[Route("api/v1")]
public class GeneralController(
    ICityRepository cityRepository,
    ISkillRepository skillRepository,
    IRegionRepository regionRepository,
    ISpecializationRepository specializationRepository,
    IUniversityRepository universityRepository,
    IUserService userService,
    StudHackDbContext dbContext,
    IEnumerable<IFiller> fillers) : ControllerBase 
{
    [HttpGet("dictionaries")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseDto<DictionariesDto>>> GetDictionaries(CancellationToken ct)
    {
        var res = new DictionariesDto
        {
            Cities = (await cityRepository.GetAllAsync(ct)).Select(e => e.ToDto()),
            Regions = (await regionRepository.GetAllAsync(ct)).Select(e => e.ToDto()),
            Skills = (await skillRepository.GetAllAsync(ct)).Select(e => e.ToDto()),
            Specializations = (await specializationRepository.GetAllAsync(ct)).Select(e => e.ToDto()),
            Universities = (await universityRepository.GetAllAsync(ct)).Select(e => e.ToDto()),
        };
        return Ok(new ApiResponseDto<DictionariesDto>(res));
    }

    [HttpPost("migrations")]
    public async Task<ActionResult> Migrate(CancellationToken ct)
    {
        await dbContext.Database.MigrateAsync(ct);
        return Ok();
    }

    [HttpPost("parse-data")]
    public async Task<ActionResult> ParseData(CancellationToken ct)
    {
        foreach (var filler in fillers)
        {
            await filler.FillAsync();
        }
        return Ok();
    }
}