using Microsoft.AspNetCore.Mvc;

namespace WebApp1.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Favorites()
        {
            return View();
        }

        public IActionResult Forecasts()  
        {
            return View();
        }
        public IActionResult CryptoTransaction()
        {
            return View();
        }
    }
}