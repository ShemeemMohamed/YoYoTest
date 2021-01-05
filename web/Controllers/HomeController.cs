using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using web.Models;
using Yoyo.ServiceContracts;
using YoYo.Models;

namespace web.Controllers
{
    public class HomeController : Controller
    {

        private readonly ILogger<HomeController> _logger;
        private IPlayerService _playerService;

        public HomeController(ILogger<HomeController> logger, IPlayerService playerService)
        {
            _logger = logger;
            _playerService = playerService;
        }

        public IActionResult Index()
        {
            YoYoTestModel model = new YoYoTestModel(); ;

            model.Players = _playerService.GetPlayers();
            return View(model);
        }
    }
}
