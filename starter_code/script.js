window.onload = function() {
  document.getElementById("start-button").onclick = function() {
    startGame();
  };

  function startGame() {
   gameBoard.start();
  }

};

var img = new Image();
img.src = './images/bg.png';

var myObstacles =[];

var gameBoard ={
  canvas: document.createElement("canvas"),
  frames: 0,
  count:0,
  start:function(){
    this.canvas.width = 480;
    this.canvas.height = 500;
    this.context = this.canvas.getContext("2d");
    document.getElementById("game-board").appendChild(this.canvas);
    this.intervalId=setInterval(updateCanvas,20);
  },
  img:img,
  x:0,
  speed: -1,

  move: function() {
    this.x += this.speed;
    this.x %= this.canvas.width;
  },

  draw: function() {
    this.context.drawImage(this.img, this.x, 0);
    if (this.speed < 0) {
      this.context.drawImage(this.img, this.x + this.canvas.width, 0);
    } else {
      this.context.drawImage(this.img, this.x - this.img.width, 0);
    }
  },
  stop: function() {
    clearInterval(this.intervalId);
  },
  
    score:function(){
      var points= this.count/2;
      this.context.font = "20px serif";
      this.context.fillstyle="white";
      this.context.fillText(points,240,100)
    }

}

var gravity =0.1;

var faby ={
    x:220,
    y:150,
    width:50,
    height:50,
    vx:0,
    vy:0,
    color:"#2e7d32",
    userPull:0,
    draw: function(){
      var ctx= gameBoard.context;
      var img=  new Image();
      
      img.src ="./images/flappy.png"
       ctx.drawImage(img,this.x,this.y,this.width,this.height);
    },
    newPos:function(){
      faby.x += faby.vx;
        faby.y += faby.vy;
    },
    left:function() {
      return this.x;
    },
    right:function() {
      return this.x + this.width;
    },
    top:function() {
      return this.y;
    },
    bottom:function() {
      return this.y + this.height;
    },
    crashWith: function(obstacle) {
      return !(
        this.bottom() < obstacle.top() ||
        this.top() > obstacle.bottom() ||
        this.right() < obstacle.left() ||
        this.left() > obstacle.right()
      );
    },
    pass: function(obstacle){
      return this.right == obstacle.left
    }
};

function updateCanvas() {
  gameBoard.move();
  var ctx = gameBoard.context;
  ctx.clearRect(0, 0, gameBoard.canvas.width, gameBoard.canvas.height);
  gameBoard.draw();

  faby.draw();
    faby.vy += gravity-faby.userPull;
    faby.newPos();
    updateObstacles();
    
    checkScore();

    gameBoard.score();
    checkGameOver();
    hitBottom();

  
}

function hitBottom(){
  var rockBottom = gameBoard.canvas.height - faby.height;
  if(faby.y > rockBottom){
      faby.y=rockBottom;
      faby.vx=0;
      faby.vy=0;
      clearInterval(gameBoard.intervalId);
      
  }
}


document.onkeydown=  function(e){
  if(e.keyCode == 87){
      faby.userPull =0.9;
      
     
  }
};

document.onkeyup = function(e){
  if(e.keyCode ==87){
      faby.userPull =-0.2;
  }
};

class Component {
  constructor(width, height, img, x, y) {
    this.width = width;
    this.height = height;
    this.img=img;
    this.x = x;
    this.y = y;
  }

  update() {
    var ctx= gameBoard.context;
      
    ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
  }
  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }

  crashWith(obstacle) {
    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );
  }
 
}
function updateObstacles() {
  for (i = 0; i < myObstacles.length; i++) {
    myObstacles[i].x += -1;
    myObstacles[i].update();
  }


  gameBoard.frames += 1;
  if (gameBoard.frames % 200 === 0) {
    var x = gameBoard.canvas.width;
    var minHeight = 25;
    var maxHeight = 400;
    var height = Math.floor(
      Math.random() * (maxHeight - minHeight + 1) + minHeight
    );
    var minGap = 75;
    var maxGap = 400;
    var gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    var topBarrel= new Image;
    var bottomBarrel= new Image;
    topBarrel.src ="./images/obstacle_top.png";
    bottomBarrel.src="./images/obstacle_bottom.png"
    myObstacles.push(new Component(50, height, topBarrel, x, 0));
    myObstacles.push(
      new Component(50, x - height - gap, bottomBarrel, x, height + gap)
    );
  }
}

function checkGameOver() {
  var crashed = myObstacles.some(function(obstacle) {
    return faby.crashWith(obstacle);
  });

  if (crashed) {
    gameBoard.stop();
  }
}
function checkScore(){
  var passed = myObstacles.some(function(obstacle) {
    return faby.pass(obstacle);
  });

  if (passed){
    gameBoard.count += 1;
    
  }
}