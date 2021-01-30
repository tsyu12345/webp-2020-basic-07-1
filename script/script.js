// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const display_count = document.querySelector('p');
// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// define Ball constructor



//define shape constructor
function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}
//ShapeコンストラクタをBallコンストラクタへ継承
class Ball extends Shape {
  constructor(x, y, velX, velY, exists, color, size) {
    super(x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  };

  update() {
    if((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }
    if((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }
  
    if((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }
  
    if((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }
  
    this.x += this.velX;
    this.y += this.velY;
  };

  collisionDetect() {
    for(let j = 0; j < balls.length; j++) {
      if(!(this === balls[j])) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + balls[j].size && balls[j].exists == true) {
          balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
        }
      }
    }
  };
}

function EvilCircle(x, y, exists) {
  Shape.call(this, x, y, 20, 20, exists);
  this.color = 'white';
  this.size = 10;
};
//EvilCircle Method definition

EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};

EvilCircle.prototype.checkBounds = function() {
  if((this.x - this.size) >= width) {
    this.x = width - this.size;
  }

  if((this.x - this.size) <= 0) {
    this.x = -(this.x);
  }

  if((this.y - this.size) >= height) {
    this.y = height - this.size;
  }

  if((this.y - this.size) <= 0) {
    this.y = -(this.y);
  }
};

EvilCircle.prototype.setControls = function() {
  let _this = this;

  window.onkeydown = function(e) {
    if(e.key === "a") {
      _this.x -= _this.velX;
    } else if(e.key === "d") {
      _this.x += _this.velX;
    } else if(e.key === "w") {
      _this.y -= _this.velY;
    } else if(e.key === "s") {
      _this.y += _this.velY;
    }
  }
};

EvilCircle.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) {
    if(balls[j].exists === true) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        ballCount--;
      }
    }
  }
};
// define array to store balls and populate it

let balls = [];

while(balls.length < 25) {
  const size = random(10,20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the adge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    true,
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );
  balls.push(ball);
}
let ballCount = balls.length;
// define loop that keeps drawing the scene constantly

let user_elp = new EvilCircle(20, 20, true);
user_elp.setControls();

function endingMsg() {
  let p_id = document.getElementById('endMsg');
  let text = document.createTextNode("WINNER!! WINNER!! Chicken dinner!!!");
  p_id.appendChild(text);
}

function loop() {
  display_count.innerHTML = ("ball count : " + ballCount);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height)
  for(let i = 0; i < balls.length; i++) {
    if(balls[i].exists == true) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
    user_elp.draw();
    user_elp.checkBounds();
    user_elp.collisionDetect();
  }
  if(ballCount == 0) {
    endingMsg();
  }
  requestAnimationFrame(loop);
}
loop();