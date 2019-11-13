class Palas extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, type, move) {
    super(scene, x, y, type);
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.body.immovable = true;
    this.body.setCollideWorldBounds(true);

    if (move) {
      this.cursor_W = scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.W
      );
      this.cursor_S = scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.S
      );
    }
  }

  update(time, delta) {
    if (this.cursor_W.isDown) this.body.setVelocityY(-300);
    else if (this.cursor_S.isDown) this.body.setVelocityY(300);
    else this.body.setVelocityY(0);
  }
}
export default Palas;
