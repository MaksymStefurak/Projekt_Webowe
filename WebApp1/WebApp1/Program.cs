var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "favorites",
    pattern: "favorites",
    defaults: new { controller = "Home", action = "Favorites" });

app.MapControllerRoute(
    name: "forecast",
    pattern: "forecasts",
    defaults: new { controller = "Home", action = "Forecasts" });

app.MapControllerRoute(
    name: "cryptoTransaction",
    pattern: "crypto-Transaction",
    defaults: new { controller = "Home", action = "CryptoTransaction" });

app.Run();

