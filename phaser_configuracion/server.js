var connections = [];
var express = require("express");
var app = express();
var server = require("http").Server(app);

app.set("port", process.env.PORT || 8081);
app.use(express.static(__dirname));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
var io = require("socket.io").listen(server);

var velox = -100;
var players = {};

io.on(
  "connection",
  function(socket) {
    socket.on("ready", () => {
      if (connections.length % 2 == 1) {
        players[socket.id] = {
          x: 30,
          y: 320
        };
        console.log(4);
      } else {
        players[socket.id] = {
          x: 1010,
          y: 320
        };
      }
      socket.emit("nuevosJugadores", players);
      socket.broadcast.emit("nuevoJugador", players[socket.id]);

      if (Object.keys(players).length == 2)
        io.emit("ponerBola", { x: 512, y: 200, velx: velox });
    });

    socket.on(
      "reiniciarBola",
      () => {
        io.emit("ponerBola", { x: 512, y: 200, velx: velox });
      },
      this
    );

    socket.on("nuevaPosicion", info => {
      socket.broadcast.emit("emitirPosicion", [info, socket.id]);
    });

    connections.push(socket.id);
    socket.on("start", function(data) {
      console.log(
        "Un usuario se ha conectado: " +
          data.id +
          " numero de conexiones " +
          connections.length
      );
    });
    console.log("nuevo usuario");

    socket.on(
      "bolaMundo",
      yB => {
        let y = yB * -1;
        io.emit("rebotaF", y);
      },
      this
    );
    socket.on("puntaje", info => {
      socket.broadcast.emit("actualizar", info);
    });

    socket.on(
      "bolaChoco",
      () => {
        console.log("choque");
        let randY = Math.floor(-150 + Math.random() * 300);
        velox = -velox;
        io.emit("reboteBola", { x: velox, y: randY });
      },
      this
    );

    socket.on("disconnect", () => {
      delete players[socket.id];
      connections.splice(connections.indexOf(socket.id), 1);
      socket.broadcast.emit("jugadorFuera");
    });
  },
  this
);

server.listen(8081, function() {
  // Listens to port 8081
  console.log("Listening on " + server.address().port);
});
