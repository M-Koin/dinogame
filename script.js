const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Game state
let dino = {
  x: 50,
  y: 150,
  velocity: 0,
  gravity: 0.8,
  jumpStrength: -15,
  width: 30,
  height: 30
};

let obstacles = [];
let gameSpeed = 5;
let spawnTimer = 0;
let isGameOver = false;
let score = 0;

function jump() {
  if (dino.y === 150) {
    dino.velocity = dino.jumpStrength;
  }
}

function createObstacle() {
  const minGap = 150;
  const maxGap = 250;
  const width = 20 + Math.random() * 20;
  
  obstacles.push({
    x: canvas.width,
    width: width,
    height: 20
  });
  
  spawnTimer = minGap + Math.random() * (maxGap - minGap);
}

function checkCollision(obstacle) {
  return dino.x + dino.width > obstacle.x &&
         dino.x < obstacle.x + obstacle.width &&
         dino.y + dino.height > canvas.height - obstacle.height;
}

function update() {
  if (isGameOver) return;

  // Dino physics
  dino.y += dino.velocity;
  dino.velocity += dino.gravity;
  dino.y = Math.min(dino.y, 150);

  // Obstacle spawning
  if (spawnTimer <= 0) {
    createObstacle();
  } else {
    spawnTimer--;
  }

  // Update obstacles
  obstacles = obstacles.filter(obstacle => {
    obstacle.x -= gameSpeed;
    return obstacle.x + obstacle.width > 0;
  });

  // Collision check
  obstacles.forEach(obstacle => {
    if (checkCollision(obstacle)) {
      isGameOver = true;
    }
  });

  // Update score and difficulty
  score++;
  scoreElement.textContent = `Score: ${Math.floor(score/5)}`;
  gameSpeed = 5 + Math.floor(score/1000);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw dino
  ctx.fillStyle = '#333';
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
  
  // Draw obstacles
  ctx.fillStyle = '#ff4444';
  obstacles.forEach(obstacle => {
    ctx.fillRect(
      obstacle.x,
      canvas.height - obstacle.height,
      obstacle.width,
      obstacle.height
    );
  });

  // Game over text
  if (isGameOver) {
    ctx.fillStyle = '#333';
    ctx.font = '24px Arial';
    ctx.fillText('Game Over! Press Space', 250, 100);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Controls
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    if (!isGameOver) {
      jump();
    } else {
      // Reset game
      obstacles = [];
      score = 0;
      gameSpeed = 5;
      isGameOver = false;
      dino.y = 150;
      dino.velocity = 0;
    }
  }
});

// Start game
gameLoop();