var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

const string AngularDevClient = "AngularDevClient";
builder.Services.AddCors(options =>
{
    options.AddPolicy(AngularDevClient, policy =>
    {
        policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors(AngularDevClient);

var summaryBands = new (int MaxC, string Summary)[]
{
    (0, "Freezing"),
    (5, "Bracing"),
    (10, "Chilly"),
    (15, "Cool"),
    (20, "Mild"),
    (25, "Warm"),
    (30, "Balmy"),
    (35, "Hot"),
    (40, "Sweltering"),
    (int.MaxValue, "Scorching")
};

static string SummaryFor((int MaxC, string Summary)[] bands, int temperatureC) =>
    bands.First(band => temperatureC <= band.MaxC).Summary;

app.MapGet("/weatherforecast", () =>
{
    var currentTemperatureC = Random.Shared.Next(10, 26);
    var forecast = Enumerable.Range(1, 5).Select(index =>
    {
        currentTemperatureC += Random.Shared.Next(-3, 4);
        return new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            currentTemperatureC,
            SummaryFor(summaryBands, currentTemperatureC)
        );
    })
    .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
