const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const playerScoreEl = document.getElementById('playerScore');
const cpuScoreEl = document.getElementById('cpuScore');

const W = canvas.width;
const H = canvas.height;

// paddles
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 110;
const PADDLE_MARGIN = 20;
const PLAYER_X = PADDLE_MARGIN;
const CPU_X = W - PADDLE_MARGIN - PADDLE_WIDTH;
let playerY = (H - PADDLE_HEIGHT) / 2;
let cpuY = (H - PADDLE_HEIGHT) / 2;
const CPU_MAX_SPEED = 5;
const PLAYER_SPEED = 7;

// ball
const R = 9;
let ball = {
  x: W / 2,
  y: H / 2,
  vx: 6 * (Math.random() > 0.5 ? 1 : -1),
  vy: (Math.random() * 6 - 3),
  speed: 6
};

let playerScore = 0;
let cpuScore = 0;

let up = false;
let down = false;
let mouseControl = false;

// mouse movement
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const y = e.clientY - rect.top;
  playerY = y - PADDLE_HEIGHT / 2;
  mouseControl = true;
});

// keyboard
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') { up = true; mouseControl = false; }
  if (e.key === 'ArrowDown') { down = true; mouseControl = false; }
});
window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp') up = false;
  if (e.key === 'ArrowDown') down = false;
});

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

function resetBall(toRight = Math.random() > 0.5) {
  ball.x = W / 2;
  ball.y = H / 2;
  ball.speed = 6;
  const angle = (Math.random() * Math.PI / 4) - (Math.PI / 8);
  ball.vx = (toRight ? 1 : -1) * ball.speed * Math.cos(angle);
  ball.vy = ball.speed * Math.sin(angle);
}

function paddleCollision(ball, px, py) {
  // simple AABB - circle collision by checking overlap horizontally and vertically with some margin
  const closestX = clamp(ball.x, px, px + PADDLE_WIDTH);
  const closestY = clamp(ball.y, py, py + PADDLE_HEIGHT);
  const dx = ball.x - closestX;
  const dy = ball.y - closestY;
  return (dx * dx + dy * dy) <= (R * R);
}

function update(dt) {
  // player keyboard movement (if not using mouse)
  if (!mouseControl) {
    if (up) playerY -= PLAYER_SPEED;
    if (down) playerY += PLAYER_SPEED;
  }

  // keep player in bounds
  playerY = clamp(playerY, 0, H - PADDLE_HEIGHT);

  // cpu AI: follow the ball with limited speed + small deadzone for smoother gameplay
  const cpuCenter = cpuY + PADDLE_HEIGHT / 2;
  const deadzone = 8;
  if (ball.x > W / 3) {
    if (ball.y < cpuCenter - deadzone) cpuY -= CPU_MAX_SPEED;
    else if (ball.y > cpuCenter + deadzone) cpuY += CPU_MAX_SPEED;
  } else {
    // slowly return to center
    const target = (H - PADDLE_HEIGHT) / 2;
    if (cpuY + PADDLE_HEIGHT / 2 < H/2 - 3) cpuY += CPU_MAX_SPEED * 0.4;
    else if (cpuY + PADDLE_HEIGHT / 2 > H/2 + 3) cpuY -= CPU_MAX_SPEED * 0.4;
  }
  cpuY = clamp(cpuY, 0, H - PADDLE_HEIGHT);

  // move ball
  ball.x += ball.vx;
  ball.y += ball.vy;

  // wall collisions
  if (ball.y - R <= 0) {
    ball.y = R;
    ball.vy = -ball.vy;
  } else if (ball.y + R >= H) {
    ball.y = H - R;
    ball.vy = -ball.vy;
  }

  // left paddle collision
  if (ball.vx < 0 && paddleCollision(ball, PLAYER_X, playerY)) {
    // compute hit position (-1..1)
    const relativeY = (ball.y - (playerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    const maxBounce = Math.PI / 3; // ~60 degrees
    const angle = relativeY * maxBounce;
    ball.speed *= 1.03; // slight speed increase
    ball.vx = ball.speed * Math.cos(angle);
    ball.vy = ball.speed * Math.sin(angle);
    // ensure ball goes right
    if (ball.vx < 2) ball.vx = 2;
  }

  // right paddle collision
  if (ball.vx > 0 && paddleCollision(ball, CPU_X, cpuY)) {
    const relativeY = (ball.y - (cpuY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    const maxBounce = Math.PI / 3;
    const angle = relativeY * maxBounce;
    ball.speed *= 1.03;
    ball.vx = -ball.speed * Math.cos(angle);
    ball.vy = ball.speed * Math.sin(angle);
    if (ball.vx > -2) ball.vx = -2;
  }

  // scoring
  if (ball.x + R < 0) {
    // cpu scores
    cpuScore++;
    cpuScoreEl.textContent = cpuScore;
    resetBall(true);
  } else if (ball.x - R > W) {
    // player scores
    playerScore++;
    playerScoreEl.textContent = playerScore;
    resetBall(false);
  }
}

function drawNet() {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  const dashH = 12, gap = 10;
  for (let y = 0; y < H; y += dashH + gap) {
    ctx.fillRect(W/2 - 1, y, 2, dashH);
  }
  ctx.restore();
}

function render() {
  ctx.clearRect(0, 0, W, H);

  // net
  drawNet();

  // paddles
  ctx.fillStyle = '#dbeafe';
  roundRect(ctx, PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, 6);
  roundRect(ctx, CPU_X, cpuY, PADDLE_WIDTH, PADDLE_HEIGHT, 6);

  // ball
  ctx.beginPath();
  ctx.fillStyle = '#f8fafc';
  ctx.arc(ball.x, ball.y, R, 0, Math.PI * 2);
  ctx.fill();

  // subtle ball highlight
  ctx.beginPath();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.arc(ball.x - 3, ball.y - 3, R * 0.5, 0, Math.PI * 2);
  ctx.fill();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

let last = performance.now();
function loop(t) {
  const dt = (t - last) / 16.666; // approx frames (60fps)
  last = t;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

// initialize
playerScoreEl.textContent = playerScore;
cpuScoreEl.textContent = cpuScore;
resetBall();
requestAnimationFrame(loop);
