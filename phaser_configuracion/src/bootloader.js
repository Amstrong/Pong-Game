class Bootloader extends Phaser.Scene {
  constructor() {
    super({ key: "Bootloader" });
  }
  preload() {
    this.load.on("complete", () => {
      this.scene.start("Scene_first");
    });
    this.load.image("ball", "./assets/ball.png");
    this.load.image("izquierda", "./assets/left_pallete.png");
    this.load.image("derecha", "./assets/right_pallete.png");
    this.load.image("separador", "./assets/separator.png");
    this.load.image("linea1", "./assets/pinkLink.png");
    this.load.image("inicio", "./assets/inicio.png");
    this.load.image("reiniciarPartida", "./assets/reiniciar.png");
  }
}

export default Bootloader;
