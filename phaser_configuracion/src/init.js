const config = {
  widht: 320 * 2,
  height: 180 * 2,
  parent: "container",
  type: Phaser.AUTO,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);
function preload() {
  this.pajaro = this.load.image("pajaro", "./assets/bird.png");
}
function create() {
  this.add.image(50, 100, "pajaro");
  this.pajaro.setScale(2);
  this.pajaro.flipX = true;
  this.pajaro.setOrigin(0, 0);
}
function update(time, delta) {
  this.pajaro.angle++;
}
