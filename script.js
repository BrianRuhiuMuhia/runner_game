const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas_width = canvas.width = 800;
canvas_height = canvas.height = 600;
const first = 2000;
let gameOver = false;
let int = 0;
let score = 0;
let enemyArr = [];
const jump=new Audio();
jump.src="assets/audio/jump.mp3"
function drawImage(sprite, x, y, width, height) {
  ctx.drawImage(sprite, x, y, width, height);
}
window.addEventListener("load", function () {
  document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowUp") {
      game.player.jump();
    }
    if (e.key == "Enter") {
      if (gameOver) reset();
    }
  });
  class Game {
    constructor() {
      this.sky = new Sky();
      this.ground = new Ground();
      this.player = new Player(this);
      this.obj = [];
    }
    draw() {
      this.obj = [this.sky, this.ground, this.player, ...this.enemies];
    }
    update(deltaTime) {
      this.enemies = enemyArr.filter((enemy) => {
        return !enemy.delete;
      });
      this.obj.forEach((obj) => {
        obj.draw();
        obj.update(deltaTime);
      });
      this.draw();
    }
  }
  class Sky {
    constructor() {
      this.x = 0;
      this.y = 0;
      this.width = 800;
      this.height = 500;
      this.image = document.getElementById("sky");
    }
    draw() {
      drawImage(this.image, this.x, this.y, this.width, this.height);
      drawImage(
        this.image,
        this.x + this.width,
        this.y,
        this.width,
        this.height,
      );
    }
    update() {
      if (this.x < -this.width) {
        this.x = 0;
      }
      this.x--;
    }
  }
  class Ground {
    constructor() {
      this.x = 0;
      this.y = 500;
      this.width = 800;
      this.height = 300;
      this.image = document.getElementById("ground");
    }
    draw() {
      drawImage(this.image, this.x, this.y, this.width, this.height);
      drawImage(
        this.image,
        this.x + this.width,
        this.y,
        this.width,
        this.height,
      );
    }
    update() {
      if (this.x < -this.width) {
        this.x = 0;
      }
      this.x -= 4;
    }
  }
  class Player {
    constructor(game) {
      this.game = game;
      this.x = 40;
      this.y = 400;
      this.width = 60;
      this.height = 100;
      this.sprites = ["player_walk_1", "player_walk_2"];
      this.current = 0;
      this.image = document.getElementById(this.sprites[this.current]);
      this.ground = 400;
      this.gravity = 3;
      this.speed = 180;
      this.interval = 0;
      this.maxT = 200;
    }
    draw() {
      drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    update(deltaTime) {
      if (this.interval > this.maxT) {
        if (this.current < this.sprites.length - 1) this.current += 1;
        else this.current = 0;
        this.interval = 0;
      } else {
        this.interval += deltaTime;
      }
      this.image = document.getElementById(this.sprites[this.current]);
      if (this.y >= this.ground) {
        this.y = this.ground;
      }
      this.y += this.gravity;
      this.game.enemies.forEach((enemy) => {
        let y1 = this.y + this.height / 2;
        let y2 = enemy.y + enemy.height / 2;
        let x1 = this.x + this.width / 2;
        let x2 = enemy.x + enemy.width / 2;
        let dist = Math.sqrt(Math.pow(y1 - y2, 2) + Math.pow(x1 - x2, 2));
        if (dist < this.width / 2 + enemy.width / 2) {
          gameOver = true;
        }
      });
    }
    jump() {
      if (this.onGround()) {
        this.y -= this.speed;
        this.image = document.getElementById("jump");
        jump.play()
      }
    }
    onGround() {
      if (this.y >= this.ground) return true;
    }
  }
  class Enemy {
    constructor(enemyType) {
      this.enemyType = enemyType;
      this.width = 50;
      this.height = 40;
      this.speed = 2;
      this.interval = 0;
      this.maxT = 200;
      this.x = canvas_width + this.width;
      this.delete = false;
      this.snailSprites = ["snail1", "snail2"];
      this.flySprites = ["fly1", "fly2"];
      this.current = 0;
      this.sprites = [];
    }
    draw() {
      if (this.enemyType == "snail") {
        this.y = 460;
        this.sprites = this.snailSprites;
        this.image = document.getElementById(this.sprites[this.current]);
      } else if (this.enemyType == "fly") {
        this.y = 330;
        this.sprites = this.flySprites;
        this.image = document.getElementById(this.sprites[this.current]);
      }
      drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    update(deltaTime) {
      if (this.interval > this.maxT) {
        if (this.current < this.sprites.length - 1) this.current += 1;
        else this.current = 0;
        this.interval = 0;
      } else {
        this.interval += deltaTime;
      }
      this.image = document.getElementById(this.sprites[this.current]);
      if (this.x + this.width < 0) {
        this.delete = true;
        score++;
      }
      this.x -= this.speed;
    }
  }
  function genEnemy() {
    enemies = ["fly", "snail", "snail"];
    enemy = enemies[Math.floor(Math.random() * enemies.length)];
    enemyArr.push(new Enemy(enemy));
  }
  function displayText() {
    ctx.fillStyle = "white";
    ctx.fillText(`Score:${score}`, 80, 55);
    ctx.font = "50px cursive";
    ctx.fillStyle = "black";
    ctx.fillText(`Score:${score}`, 80, 50);
    ctx.font = "50px cursive";
    if (gameOver) {
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      ctx.fillText(`Game Over`, canvas_width / 2, canvas_height / 2);
      ctx.font = "50px cursive";
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      ctx.font = "50px cursive";
      ctx.fillText(
        `Press Enter To Restart`,
        canvas_width / 2,
        canvas_height / 2 - 50,
      );
      ctx.fillStyle = "white";
      ctx.font = "50px cursive";
      ctx.fillText(
        `Press Enter To Restart`,
        canvas_width / 2,
        canvas_height / 2 - 55,
      );
    }
  }
  function reset() {
    enemyArr = [];
    score = 0;
    gameOver = false;
    animate(0);
  }
  genEnemy();
  setInterval(genEnemy, first);
  deltaTime = 0;
  let game = new Game();
  function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas_width, canvas_height);
    deltaTime = timeStamp - int;
    game.update(deltaTime);
    displayText();
    if (!gameOver) requestAnimationFrame(animate);
    int = timeStamp;
  }
  animate(0);
});
