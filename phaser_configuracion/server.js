var connections = [];
var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io").listen(server);
app.use(express.static(__dirname));
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
server.listen(8081, function() {
  // Listens to port 8081
  console.log("Listening on " + server.address().port);
});

players = {};

io.on(
  "connection",
  function(socket) {
    socket.on("ready", player1 => {
      if (connections.length == 1) {
        players[socket.id] = {
          x: 30,
          y: 320
        };
        console.log(4);
      } else {
        players[socket.id] = {
          x: 610,
          y: 320
        };
      }
      socket.emit("nuevosJugadores", players);
      socket.broadcast.emit("nuevoJugador", players[socket.id]);
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

    socket.on("disconnect", () => {
      delete players[socket.id];
      connections.splice(connections.indexOf(socket.id), 1);
    });
  },
  this
);
