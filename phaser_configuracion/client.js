var socket = io.connect("localhost:8081");
var data = {
  id: socket.id
};
socket.emit("start", data);
