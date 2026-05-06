using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ShiftsController : ControllerBase
{
    private readonly SharePointService _spService;

    public ShiftsController(SharePointService spService)
    {
        _spService = spService;
    }

    // START SHIFT
    [HttpPost("start")]
    public async Task<IActionResult> StartShift([FromBody] ShiftStartDto shiftStart)
    {
        DateTime now = DateTime.Now;
        DateTime hour1;

        if (now.Hour >= 6 && now.Hour < 14)
            hour1 = new DateTime(now.Year, now.Month, now.Day, 6, 0, 0);
        else if (now.Hour >= 14 && now.Hour < 22)
            hour1 = new DateTime(now.Year, now.Month, now.Day, 14, 0, 0);
        else
        {
            hour1 = new DateTime(now.Year, now.Month, now.Day, 22, 0, 0);
            if (now.Hour < 6)
                hour1 = hour1.AddDays(-1);
        }

        string title = $"{hour1:MM/dd/yyyy}, {hour1.Hour}:00 - {hour1.AddHours(8).Hour}:00";

        var shiftData = new
        {
            Title = title,
            Szalagvezeto = shiftStart.Szalagvezeto,
            Muszerez = shiftStart.Muszerez,
            StartTime = hour1
        };

        var result = await _spService.CreateShift(shiftData);

        return Ok(result);
    }

    // SAVE PROGRESS
    [HttpPost("{shiftId}/progress")]
    public async Task<IActionResult> SaveProgress(int shiftId, [FromBody] IslandProgressDto dto)
    {
        var progressData = new
        {
            Title = $"Shift {shiftId} - Island {dto.IslandIndex}",
            ShiftId = shiftId,
            IslandIndex = dto.IslandIndex,
            Value = dto.Value
        };

        var result = await _spService.SaveProgress(progressData);

        return Ok(result);
    }

    // GET PROGRESS
    [HttpGet("progress")]
    public async Task<IActionResult> GetProgress()
    {
        var result = await _spService.GetProgress();
        return Ok(result);
    }
}