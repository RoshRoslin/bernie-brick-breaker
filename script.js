const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const bernie = document.getElementById("bernie");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");

var scaleX = window.innerWidth / canvas.width;
var scaleY = window.innerHeight / canvas.height;

var scaleToFit = Math.min(scaleX, scaleY);
var scaleToCover = Math.max(scaleX, scaleY);

let score = 0;

// console.log(bernie);

const brickRowCount = 9;
const brickColumnCount = 5;

//create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

//create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 1,
  h: 1,
  speed: 8,
  dx: 0,
};

//create bernie props
const berniePaddle = {
  x: canvas.width / 2 - 75,
  y: canvas.height - 130,
  w: 150,
  h: 180,
  speed: 8,
  dx: 0,
};

//create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

//create bricks
const bricks = [];

for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

//optimize for mobile
function optimizeForMobile() {
  canvas.style.transformOrigin = "0 0"; //scale from top left
  canvas.style.transform = "scale(" + scaleToFit + ")";
}

// Draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = " #1c3c81";
  ctx.fill();
  ctx.closePath();
}

// // Draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = " #1c3c81";
  ctx.fill();
  ctx.closePath();
}

//draw score on canvas
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

//draw bricks on canvas
function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? " #1c3c81" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

function drawBernie() {
  ctx.drawImage(
    bernie,
    berniePaddle.x,
    berniePaddle.y,
    berniePaddle.w,
    berniePaddle.h
  );
}

//move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx;

  //wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

function moveBernie() {
  berniePaddle.x += berniePaddle.dx;

  //wall detection
  if (berniePaddle.x + berniePaddle.w > canvas.width) {
    berniePaddle.x = canvas.width - berniePaddle.w;
  }

  if (berniePaddle.x < 0) {
    berniePaddle.x = 0;
  }
}

// move ball + collision detection
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }

  if (ball.y + ball.size > canvas.width || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  //paddle collision
  if (
    ball.x + ball.size > berniePaddle.x &&
    ball.x + ball.size < berniePaddle.x + berniePaddle.w &&
    ball.y + ball.size > berniePaddle.y
  ) {
    ball.dy = -ball.speed;
  }

  //brick collision
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x + ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1;
          brick.visible = false;
          increaseScore();
        }
      }
    });
  });

  // hit bottom wall
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

//increase score
function increaseScore() {
  score++;

  if (score % (brickRowCount * brickRowCount) === 0) {
    showAllBricks();
  }
}

//show all bricks

function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
}

//draw everything
function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBernie();
  drawScore();
  drawBall();
  drawPaddle();
  drawBricks();
  // optimizeForMobile();
}

//update canvas drawin and animation
function update() {
  movePaddle();
  moveBernie();
  moveBall();
  draw();

  requestAnimationFrame(update);
}

update();

//controls
function keyDown(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.target.id === "right-btn"
  ) {
    paddle.dx = paddle.speed;
    berniePaddle.dx = berniePaddle.speed;
  } else if (
    e.key === "Left" ||
    e.key === "ArrowLeft" ||
    e.target.id === "left-btn"
  ) {
    paddle.dx = -paddle.speed;
    berniePaddle.dx = -berniePaddle.speed;
  }
}

function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft" ||
    e.target.id === "right-btn" ||
    e.target.id === "left-btn"
  ) {
    paddle.dx = 0;
    berniePaddle.dx = 0;
  }
}

//keyboard event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
leftBtn.addEventListener("mousedown", keyDown);
leftBtn.addEventListener("mouseup", keyUp);
rightBtn.addEventListener("mousedown", keyDown);
rightBtn.addEventListener("mouseup", keyUp);
leftBtn.addEventListener("touchstart", keyDown);
leftBtn.addEventListener("touchend", keyUp);
rightBtn.addEventListener("touchstart", keyDown);
rightBtn.addEventListener("touchend", keyUp);

//rules and close event handlers
rulesBtn.addEventListener("click", () => {
  rules.classList.add("show");
});

closeBtn.addEventListener("click", () => {
  rules.classList.remove("show");
});
