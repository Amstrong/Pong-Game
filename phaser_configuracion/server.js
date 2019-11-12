var connections = [];
var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io").listen(server);
//app.use("/assets", express.static(__dirname + "/assets/"));
//app.use("/src", express.static(__dirname + "/src/"));
app.use(express.static(__dirname));
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
server.listen(8081, function() {
  // Listens to port 8081
  console.log("Listening on " + server.address().port);
});
var socket = require("socket.io");
var io = socket(server);

io.sockets.on("connection", function(socket) {
  connections.push(socket);
  socket.on("start", function(data) {
    console.log(
      "Un usuario se ha conectado: " +
        data.id +
        " numero de conexiones " +
        connections.length
    );
  });
});
