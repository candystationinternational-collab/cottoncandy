using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CandyStation.Api.Controllers.Admin;

public record UploadResponse(string Url);

// Lets admins attach real product photos without needing external image hosting —
// files land in wwwroot/uploads and are served back as plain static URLs.
[ApiController]
[Route("api/admin/uploads")]
[Authorize(Roles = "Admin")]
public class AdminUploadsController(IWebHostEnvironment env) : ControllerBase
{
    private static readonly HashSet<string> AllowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
    private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5 MB

    [HttpPost]
    [RequestSizeLimit(MaxFileSizeBytes)]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file.Length == 0)
            return BadRequest(new { message = "No file was uploaded." });

        if (file.Length > MaxFileSizeBytes)
            return BadRequest(new { message = "File is too large (max 5 MB)." });

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            return BadRequest(new { message = "Only PNG, JPG, WEBP, and GIF images are allowed." });

        var webRoot = string.IsNullOrEmpty(env.WebRootPath)
            ? Path.Combine(env.ContentRootPath, "wwwroot")
            : env.WebRootPath;
        var uploadsDir = Path.Combine(webRoot, "uploads");
        Directory.CreateDirectory(uploadsDir);

        var fileName = $"{Guid.NewGuid():N}{ext}";
        var filePath = Path.Combine(uploadsDir, fileName);

        await using (var stream = System.IO.File.Create(filePath))
        {
            await file.CopyToAsync(stream);
        }

        return Ok(new UploadResponse($"/uploads/{fileName}"));
    }
}
