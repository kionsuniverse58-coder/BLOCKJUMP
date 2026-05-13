window.onload = function () {

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

if (!canvas || !ctx) {
  console.error("Canvas not found");
  return;
}

let gameOver = false;
let score = 0;

// PLAYER
let player = {
  x: 120,
  y: 300,
  w: 28,
  h: 28,
  vy: 0,
  jumping: false
};

const speed = 2.5;
const gravity = 0.5;
const jumpPower = -10.5;

// SPIKES
let spikes = [];
for (let i = 0; i < 50; i++) {
  spikes.push({
    x: 420 + i * 300,
    y: 330,
    w: 20,
    h: 20
  });
}

// INPUT
let keys = {};

document.addEventListener("keydown", e => {
  keys[e.key] = true;

  if (gameOver && e.key === " ") reset();

  if (e.key === " ") jump();
});

document.addEventListener("keyup", e => {
  keys[e.key] = false;
});

// JUMP
function jump() {
  if (!player.jumping && player.y >= 300) {
    player.vy = jumpPower;
    player.jumping = true;
  }
}

// RESET
function reset() {
  gameOver = false;
  score = 0;

  player.y = 300;
  player.vy = 0;
  player.jumping = false;

  spikes.forEach((s, i) => {
    s.x = 420 + i * 300;
  });
}

// UPDATE
function update() {
  if (gameOver) return;

  score += 0.05;

  // physics
  player.vy += gravity;
  player.y += player.vy;

  if (player.y >= 300) {
    player.y = 300;
    player.vy = 0;
    player.jumping = false;
  }

  // spikes
  for (let s of spikes) {
    s.x -= speed;

    if (s.x < -50) {
      s.x = 1200 + Math.random() * 400;
    }

    if (
      player.x < s.x + s.w &&
      player.x + player.w > s.x &&
      player.y < s.y &&
      player.y + player.h > s.y - s.h
    ) {
      gameOver = true;
    }
  }
}

// SPIKE (BLACK GD STYLE)
function drawSpike(x, y, w, h) {
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w / 2, y - h);
  ctx.lineTo(x + w, y);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#fff";
  ctx.stroke();
}

// DRAW
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // floor
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 330, 800, 70);

  // spikes
  for (let s of spikes) {
    drawSpike(s.x, s.y, s.w, s.h);
  }

  // =========================
  // GEOMETRY DASH CUBE (CLEAN MODEL)
  // =========================
  ctx.save();

  ctx.translate(player.x + player.w / 2, player.y + player.h / 2);

  ctx.rotate(player.vy * 0.04);

  let scaleY = player.jumping ? 0.85 : 1.05;
  ctx.scale(1, scaleY);

  // OUTLINE
  ctx.fillStyle = "#000";
  ctx.fillRect(-player.w/2 - 3, -player.h/2 - 3, player.w + 6, player.h + 6);

  // MAIN CUBE
  ctx.fillStyle = "#fff";
  ctx.fillRect(-player.w/2, -player.h/2, player.w, player.h);

  // INNER SHADOW
  ctx.fillStyle = "#cfcfcf";
  ctx.fillRect(-player.w/2 + 3, -player.h/2 + 3, player.w - 6, player.h - 6);

  // FACE :]
  ctx.fillStyle = "#000";
  ctx.fillRect(-6, -4, 3, 3);
  ctx.fillRect(3, -4, 3, 3);
  ctx.fillRect(-6, 6, 12, 2);

  ctx.restore();

  // SCORE
  ctx.fillStyle = "white";
  ctx.font = "20px Arcade";
  ctx.fillText("Score: " + Math.floor(score), 10, 30);

  // GAME OVER
  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", 230, 200);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Press SPACE to restart", 240, 240);
  }
}

// LOOP
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

};