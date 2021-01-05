using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace YoYo.Models
{
    public class PlayerModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Warn { get; set; }
        public bool Stop { get; set; }
        public int LevelNumber { get; set; }
        public int ShuttleNumber { get; set; }
    }
}
