import Palas from "../gameObjects/palas.js";
class Scene_play extends Phaser.Scene {
  constructor() {
    super({ key: "Scene_play" });
  }

  create() {
    var ScoreLeft = this.add.text(100, 6, 0, {
      color: "#ffffff",
      fontSize: 40
    });
    var ScoreRight = this.add.text(this.sys.game.config.width - 100, 6, 0, {
      color: "#ffffff",
      fontSize: 40
    });

    var counterLeft = 0;
    var counterRight = 0;
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
    this.ball.setVelocityX(-300);

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

    //Controles
    //Pala derecha
    this.cursor = this.input.keyboard.createCursorKeys();
    //Pala izquierda
    this.cursor_W = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.W
    );
    this.cursor_S = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    ScoreLeft.text = counterLeft;
    ScoreRight.text = counterRight;
  }
  update() {
    //Control de las palas
    //Pala derecha
    if (this.cursor.down.isDown) {
      this.derecha.body.setVelocityY(280);
    } else if (this.cursor.up.isDown) {
      this.derecha.body.setVelocityY(-280);
    } else {
      this.derecha.body.setVelocityY(0);
    }
    //Pala izquierda
    if (this.cursor_S.isDown) {
      this.izquierda.body.setVelocityY(280);
    } else if (this.cursor_W.isDown) {
      this.izquierda.body.setVelocityY(-280);
    } else {
      this.izquierda.body.setVelocity(0);
    }
    if (this.ball.x < 0) {
      //counterLeft += 1;
      this.ball.setPosition(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2
      );
    } else if (this.ball.x > this.sys.game.config.width) {
      // counterRight += 1;
      this.ScoreRight.add.text();
      this.ball.setPosition(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2
      );
    }
  }
  chocaPala() {
    this.ball.setVelocityY(Phaser.Math.Between(-150, 150));
  }
  //Metodo activo
}

export default Scene_play;
