import Scene_play from "../scenes/scene_play.js";
class Scene_win extends Phaser.Scene {
  constructor() {
    super({ key: "Scene_win" });
  }
  init(data) {
    this.ganador = data.ganador;
  }
  preload() {
    this.load.bitmapFont("font", "./assets/font.png", "./assets/font.xml");
  }
  create() {
    this.infoScene = this.add.bitmapText(
      166,
      170,
      "font",
      "Felicitaciones, el ganador es   " + this.ganador,
      30
    );
    var restartScene = this.add
      .image(360, 250, "reiniciarPartida")
      .setInteractive();
    restartScene.on(
      "pointerdown",
      function(event) {
        this.scene.start("Scene_play");
      },
      this
    );
    var returnHome = this.add.image(680, 250, "inicio").setInteractive();
    returnHome.on(
      "pointerdown",
      function(event) {
        this.scene.start("Scene_first");
      },
      this
    );
  }
}
export default Scene_win;
