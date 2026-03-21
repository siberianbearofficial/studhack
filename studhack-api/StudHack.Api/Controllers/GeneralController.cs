using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudHack.Api.Dtos;
using StudHack.Api.Extensions;
using StudHack.Domain.Abstractions.Repositories;
using StudHack.Domain.Interfaces.Repositories;

namespace StudHack.Api.Controllers;

[ApiController]
[Route("api/v1")]
public class GeneralController(
    ICityRepository cityRepository,
    ISkillRepository skillRepository,
    IRegionRepository regionRepository,
    ISpecializationRepository specializationRepository) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponseDto<DictionariesDto>>> GetDictionaries(CancellationToken ct)
    {
        var res = new DictionariesDto
        {
            Cities = (await cityRepository.GetAllAsync(ct)).Select(e => e.ToDto()),
            Regions = (await regionRepository.GetAllAsync(ct)).Select(e => e.ToDto()),
            Skills = (await skillRepository.GetAllAsync(ct)).Select(e => e.ToDto()),
            Specializations = (await specializationRepository.GetAllAsync(ct)).Select(e => e.ToDto()),
        };
        return Ok(new ApiResponseDto<DictionariesDto>(res));
    }
}