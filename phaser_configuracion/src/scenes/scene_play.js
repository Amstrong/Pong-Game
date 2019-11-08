import Palas from "../gameObjects/palas.js";
import Scene_win from "./scene_win.js";
class Scene_play extends Phaser.Scene {
  constructor() {
    super({ key: "Scene_play" });
  }

  preload() {
    this.load.bitmapFont("font", "./assets/font.png", "./assets/font.xml");
    this.load.audio("upAndDown", "./assets/Pop.mp3");
    this.load.audio("ballOut", "./assets/Drill_Gear.mp3");
  }

  create() {
    //Creación del sonido (Variables)
    this.ballOut = this.sound.add("ballOut", { loop: false });
    this.upAndDown = this.sound.add("upAndDown", { loop: false });
    this.ScoreLeft = this.add.bitmapText(400, 6, "font", "0", 40);
    this.ScoreRight = this.add.bitmapText(
      this.sys.game.config.width - 428,
      6,
      "font",
      "0",
      40
    );

    //Variables para Marcadores
    this.valor1 = 0;
    this.valor2 = 0;
    //Dimensiones de pantalla
    let center_width = this.sys.game.config.width / 2;
    let center_height = this.sys.game.config.height / 2;
    let screen = this.sys.game.config.width;

    //Separador
    this.add.image(center_width, center_height, "separador");
    //Palas
    this.izquierda = new Palas(this, 30, center_height, "izquierda");
    this.derecha = new Palas(this, screen - 30, center_height, "derecha");

    //Bola
    this.physics.world.setBoundsCollision(false, false, true, true);
    this.ball = this.physics.add.image(center_width, center_height, "ball");
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1);
    this.ball.setVelocityX(-500);

    //Fisicas
    this.physics.add.collider(
      this.ball,
      this.izquierda,
      this.chocaPala,
      null,
      this
    );
    this.physics.add.collider(
      this.ball,
      this.derecha,
      this.chocaPala,
      null,
      this
    );

    //CONTROLES
    this.cursor = this.input.keyboard.createCursorKeys();
    this.cursor_W = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.W
    );
    this.cursor_S = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    // this.input.keyboard.on("keydown-TWO", () => {
    //   this.scene.pause("Scene_play");
    // });
    // this.input.keyboard.on("keydown-THREE", () => {
    //   this.scene.launch("Scene_play");
    // });
  }
  update() {
    //Pala derecha
    if (this.cursor.down.isDown) {
      this.derecha.body.setVelocityY(310);
    } else if (this.cursor.up.isDown) {
      this.derecha.body.setVelocityY(-310);
    } else {
      this.derecha.body.setVelocityY(0);
    }
    //Pala izquierda
    if (this.cursor_S.isDown) {
      this.izquierda.body.setVelocityY(310);
    } else if (this.cursor_W.isDown) {
      this.izquierda.body.setVelocityY(-310);
    } else {
      this.izquierda.body.setVelocity(0);
    }
    if (this.ball.x < 0) {
      this.MarcadorDerecha();
      this.ballOut.play();
      this.ball.setPosition(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2
      );
    } else if (this.ball.x > this.sys.game.config.width) {
      this.MarcadorIzquierda();
      this.ballOut.play();
      this.ball.setPosition(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2
      );
    }
  }

  //METODOS
  chocaPala() {
    this.ball.setVelocityY(Phaser.Math.Between(-150, 150));
    this.upAndDown.play();
  }
  MarcadorIzquierda() {
    this.ScoreLeft.text = this.valor1 += 1;
    this.finishGame();
  }
  MarcadorDerecha() {
    this.ScoreRight.text = this.valor2 += 1;
    this.finishGame();
  }
  finishGame() {
    var ganador;
    if (this.ScoreLeft.text == 7) {
      this.ScoreLeft.text = 0;
      this.valor1 = 0;
      this.scene.start("Scene_win", { ganador: "jugador 1" });
      this.ganador = "Jugador 1";
      var prueba = this.add.image(250, 280, "boton").setInteractive();
      prueba.on("pointerdown", function(pointer) {
        this.scene.restart("Scene_play");
      });
    } else if (this.ScoreRight.text == 7) {
      this.ScoreRight.text = 0;
      this.valor2 = 0;
      this.ganador = "jugador 2";
      this.scene.start("Scene_win", { ganador: "jugador 2" });
    }
  }
}

export default Scene_play;
