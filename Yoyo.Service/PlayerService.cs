using System;
using System.Collections.Generic;
using Yoyo.Models.ViewModel;
using Yoyo.ServiceContracts;
using YoYo.Models;

namespace Yoyo.Service
{
    public class PlayerService : IPlayerService
    {

        public List<PlayerModel> GetPlayers()
        {
            List<PlayerModel> players = new List<PlayerModel>();

            players.Add(new PlayerModel
            {
                Id = 1,
                Name = "Sachin Tendulkar",
                Warn = false,
                Stop = false,
                LevelNumber = 0,
                ShuttleNumber = 0
            });
            players.Add(new PlayerModel
            {
                Id = 2,
                Name = "Rahul Dravid",
                Warn = false,
                Stop = false,
                LevelNumber = 0,
                ShuttleNumber = 0
            });
            players.Add(new PlayerModel
            {
                Id = 3,
                Name = "Ricky Ponting",
                Warn = false,
                Stop = false,
                LevelNumber = 0,
                ShuttleNumber = 0
            });
            players.Add(new PlayerModel
            {
                Id = 4,
                Name = "Brian Lara",
                Warn = false,
                Stop = false,
                LevelNumber = 0,
                ShuttleNumber = 0
            });
            players.Add(new PlayerModel
            {
                Id = 5,
                Name = "MS Dhoni",
                Warn = false,
                Stop = false,
                LevelNumber = 0,
                ShuttleNumber = 0
            });

            return players;
        }

        public PlayerResultVM GetPlayerResult(int playerId, string result)
        {
            PlayerResultVM playerResult = new PlayerResultVM();
            List<PlayerModel> playersList = GetPlayers();
            int editIndex = playersList.FindIndex(o => o.Id == playerId);
            playerResult.Id = playersList[editIndex].Id;
            playerResult.Result = result;
            return playerResult;
        }

        public PlayerModel WarnPlayer(int playerId)
        {
            var playersList = GetPlayers();
            int editIndex = playersList.FindIndex(o => o.Id == playerId);
            playersList[editIndex].Warn = true;
            return playersList[editIndex];
        }
    }
}
