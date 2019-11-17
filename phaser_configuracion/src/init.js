import Bootloader from "./bootloader.js";
import Scene_play from "./scenes/scene_play.js";
import scene_first from "./scenes/scene_first.js";
import scene_win from "./scenes/scene_win.js";
const config = {
  widht: 640,
  height: 400,
  parent: "container",
  physics: {
    default: "arcade"
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [Bootloader, Scene_play, scene_first, scene_win]
};
var game = new Phaser.Game(config);
