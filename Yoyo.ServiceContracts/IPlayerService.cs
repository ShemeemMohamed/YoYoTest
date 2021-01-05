using System;
using System.Collections.Generic;
using Yoyo.Models.ViewModel;
using YoYo.Models;

namespace Yoyo.ServiceContracts
{
    public interface IPlayerService
    {
        List<PlayerModel> GetPlayers();
        PlayerModel WarnPlayer(int playerId);
        PlayerResultVM GetPlayerResult(int playerId, string result);
    }
}
