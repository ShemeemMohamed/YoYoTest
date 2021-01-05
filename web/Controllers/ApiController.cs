
using System;
using System.Collections.Generic;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Yoyo.Models.ViewModel;
using Yoyo.ServiceContracts;
using YoYo.Models;

namespace YoYo.Controllers
{
    [Route("api")]
    [ApiController]
    public class ApiController : ControllerBase
    {

        private IPlayerService _playerService;

        public ApiController(IPlayerService playerService)
        {
            _playerService = playerService;
        }


        [HttpGet("GetPlayers")]
        public ActionResult GetPlayers()
        {
            return Ok(_playerService.GetPlayers());
        }

        [HttpGet("FitnessRating")]
        public ActionResult GetFitnessRating()
        {
            var fitnessRatingData = new List<Rating>();
            var folderDetails = Path.Combine(Directory.GetCurrentDirectory(), $"wwwroot\\{"data\\fitnessrating_beeptest.json"}");
            var jsonText = System.IO.File.ReadAllText(folderDetails);

            JArray jsonArray = JArray.Parse(jsonText);
            foreach (var item in jsonArray)
            {
                var jsonObj = JsonConvert.DeserializeObject<Rating>(item.ToString());
                fitnessRatingData.Add(jsonObj);
            }

            return Ok(fitnessRatingData);
        }


        [HttpGet("WarnPlayer/{id}")]
        public ActionResult WarnPlayer(int id)
        {
            var allPlayers = _playerService.GetPlayers();
            try
            {
                int editIndex = allPlayers.FindIndex(o => o.Id == id);
                allPlayers[editIndex].Warn = true;
                return Ok(allPlayers[editIndex]);
            }
            catch
            {
                return NotFound();
            }

        }

        [HttpPost("ResultPlayer/{id}")]
        public ActionResult ResultPlayer([FromForm]PlayerResultVM playerResultRecieved)
        {
            var playerResult = _playerService.GetPlayerResult(playerResultRecieved.Id, playerResultRecieved.Result);

            return Ok(playerResult);
        }


    }
}