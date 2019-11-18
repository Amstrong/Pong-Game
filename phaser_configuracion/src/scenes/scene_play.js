import Palas from "../gameObjects/palas.js";
import Scene_win from "./scene_win.js";
class Scene_play extends Phaser.Scene {
  constructor() {
    super({ key: "Scene_play" });

    //console.log(this.socket);
  }

  preload() {
    this.load.bitmapFont("font", "./assets/font.png", "./assets/font.xml");
    this.load.audio("upAndDown", "./assets/Pop.mp3");
    this.load.audio("ballOut", "./assets/Drill_Gear.mp3");
  }

  create() {
    this.socket = io();
    // this.socket.on(
    //   "connect",
    //   () => {
    //     this.socket.emit("ready");
    //   },
    //   this
    // );

    this.socket.on("connect", () => {
      this.socket.emit("ready");
    });

    this.registrarSocket();

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
    // this.izquierda = new Palas(this, 30, center_height, "izquierda");
    // this.derecha = new Palas(this, screen - 30, center_height, "derecha");

    //Bola
    this.physics.world.setBoundsCollision(false, false, true, true);
    //this.ball = this.physics.add.image(center_width, center_height, "ball");
    //this.ball.setCollideWorldBounds(true);
    // this.ball.setBounce(1);
    //this.ball.setVelocityX(-500);

    //Fisicas
    // this.physics.add.collider(
    //   this.ball,
    //   this.izquierda,
    //   this.chocaPala,
    //   null,
    //   this
    // );
    // this.physics.add.collider(
    //   this.ball,
    //   this.derecha,
    //   this.chocaPala,
    //   null,
    //   this
    // );

    //CONTROLES
    this.cursor = this.input.keyboard.createCursorKeys();

    this.puedeChocar = true;
    // this.input.keyboard.on("keydown-TWO", () => {
    //   this.scene.pause("Scene_play");
    // });
    // this.input.keyboard.on("keydown-THREE", () => {
    //   this.scene.launch("Scene_play");
    // });

    this.socket.on(
      "emitirPosicion",
      pos => {
        if (this.otroJugador) {
          this.otroJugador.x = pos[0].x;
          this.otroJugador.y = pos[0].y;
        }
      },
      this
    );
  }
  update() {
    if (this.player) this.player.update();
    if (this.ball) {
      let yMax = this.ball.getBounds().top;
      let yMin = this.ball.getBounds().bottom;
      let xMin = this.ball.getBounds().left;
      let xMax = this.ball.getBounds().right;
      if ((yMax <= 0 || yMin >= 400) && this.puedeChocar) {
        this.socket.emit("bolaMundo", this.ball.body.velocity.y);
        this.puedeChocar = false;
        setTimeout(() => {
          this.puedeChocar = true;
        }, 500);
      }
      if (xMin <= -10 || xMax >= 1034) {
        if (this.ball) {
          if (xMin <= -10) {
            this.MarcadorDerecha();
            this.socket.emit("puntaje", true);
          } else {
            if (xMax >= 1034) {
              this.MarcadorIzquierda();
              this.socket.emit("puntaje", false);
            }
          }
          this.ball.destroy();
          this.socket.emit("reiniciarBola");
        }
      }
    }
    // if (this.ball.x < 0) {
    //   this.MarcadorDerecha();
    //   this.ballOut.play();
    //   this.ball.setPosition(
    //     this.sys.game.config.width / 2,
    //     this.sys.game.config.height / 2
    //   );
    // } else if (this.ball.x > this.sys.game.config.width) {
    //   this.MarcadorIzquierda();
    //   this.ballOut.play();
    //   this.ball.setPosition(
    //     this.sys.game.config.width / 2,
    //     this.sys.game.config.height / 2
    //   );
    // }
  }

  //METODOS'

  chocaPala() {
    this.socket.emit("bolaChoco");
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

  registrarSocket() {
    this.socket.on(
      "nuevosJugadores",
      jugadores => {
        Object.keys(jugadores).forEach(id => {
          console.log(2);
          if (this.socket.id == id) {
            this.addJugador(jugadores[id]);
          } else {
            this.addOtroJugador(jugadores[id]);
          }
        });
      },
      this
    );

    this.socket.on("actualizar", id => {
      console.log("actualizar");
      if (id == true) {
        this.MarcadorDerecha();
      } else {
        this.MarcadorDerecha();
      }
    });

    this.socket.on(
      "nuevoJugador",
      player => {
        this.addOtroJugador(player);
      },
      this
    );

    this.socket.on(
      "rebotaF",
      y => {
        if (this.ball) {
          console.log(y);
          this.ball.setVelocityY(y);
        }
      },
      this
    );

    this.socket.on(
      "ponerBola",
      info => {
        this.ball = this.physics.add
          .image(info.x, info.y, "ball")
          .setOrigin(0.5, 0.5);
        //this.ball.setCollideWorldBounds(true);
        this.ball.setVelocityX(info.velx);
        this.bolaCollision = this.physics.add.collider(
          this.player,
          this.ball,
          this.chocaPala,
          null,
          this
        );
        this.ballWorldCollision = this.physics.add.collider(
          this.ball,
          this.physics.world.bounds,
          this.chocaPala,
          null,
          this
        );
      },
      this
    );

    this.socket.on(
      "reboteBola",
      info => {
        if (this.ball) {
          this.ball.setVelocityY(info.y);
          this.ball.setVelocityX(info.x);
        }
      },
      this
    );

    this.socket.on(
      "jugadorFuera",
      () => {
        if (this.otroJugador) this.otroJugador.destroy();
      },
      this
    );
  }

  addJugador(player) {
    this.player = new Palas(
      this,
      player.x,
      player.y,
      "derecha",
      true,
      this.socket
    );

    // this.player.setBoundsCollision(false, false, true, true);
  }

  addOtroJugador(player) {
    this.otroJugador = new Palas(
      this,
      player.x,
      player.y,
      "izquierda",
      false,
      this.socket
    );
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
