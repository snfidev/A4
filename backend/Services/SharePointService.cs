using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

public class SharePointService
{
    private readonly IHttpClientFactory _httpClientFactory;

    private readonly string baseUrl =
        "https://sanofi.sharepoint.com/sites/smscsanyik/_api/web/lists";

    public SharePointService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    // CREATE SHIFT
    public async Task<string> CreateShift(object data)
    {
        var client = _httpClientFactory.CreateClient();

        var url = $"{baseUrl}/GetByTitle('Shifts')/items";

        var response = await client.PostAsJsonAsync(url, data);

        return await response.Content.ReadAsStringAsync();
    }

    // SAVE PROGRESS
    public async Task<string> SaveProgress(object data)
    {
        var client = _httpClientFactory.CreateClient();

        var url = $"{baseUrl}/GetByTitle('Progress')/items";

        var response = await client.PostAsJsonAsync(url, data);

        return await response.Content.ReadAsStringAsync();
    }

    // GET PROGRESS
    public async Task<string> GetProgress()
    {
        var client = _httpClientFactory.CreateClient();

        var url = $"{baseUrl}/GetByTitle('Progress')/items";

        var response = await client.GetAsync(url);

        return await response.Content.ReadAsStringAsync();
    }
}