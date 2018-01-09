var canvas;
var canvasContext;
var tBallX = 50;
var tBallY = 50;
var tBallSpeedX = 10;
var tBallSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const winningScore = 3; //11;

var displayWinScreen = false;

var leftPaddleY = 250;
var rightPaddleY = 250;
const paddleHeight = 100; //constant; will never change
const paddleThickness = 10;

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect(); //court/canvas area
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft; //x and y coordinate w/in playable space
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x:mouseX,
    y:mouseY
  };
}

function handleMouseClick(evt) {
  if (displayWinScreen) {
    player1Score = 0;
    player2Score = 0;
    displayWinScreen = false;
  }
}

window.onload = function() {
canvas = document.getElementById('gameCanvas');
canvasContext = canvas.getContext('2d');

var framesPerSecond = 30;
setInterval(function() {
  moveEverything();
  drawEverything();
}, 1000/framesPerSecond);

canvas.addEventListener('mousedown', handleMouseClick);

//mouse movement
canvas.addEventListener('mousemove', function(evt) {
  var mousePos = calculateMousePos(evt);
  leftPaddleY = mousePos.y-(paddleHeight/2);
});
}

function resetBall() {
  if (player1Score >= winningScore || player2Score >= winningScore) {
    displayWinScreen = true;
  }
  tBallSpeedX = -tBallSpeedX;
  tBallX = canvas.width/2;
  tBallY = canvas.height/2;
}

function computerMovement() {
   var rightPaddleYCenter = rightPaddleY + (paddleHeight/2);
   if (rightPaddleYCenter < tBallY-35) {
     rightPaddleY += 6;
   } else if (rightPaddleYCenter > tBallY+35) {
     rightPaddleY -= 6;
   }
}

function moveEverything() {
  if (displayWinScreen) {
    return;
  }
    computerMovement();
    tBallX += tBallSpeedX;
    tBallY += tBallSpeedY;

    if (tBallX > canvas.width) {
      if (tBallY > rightPaddleY &&
        tBallY < rightPaddleY + paddleHeight) {
          tBallSpeedX = -tBallSpeedX;
          //deltaY: control direction ball goes when hit
          var deltaY = tBallY - (rightPaddleY + paddleHeight/2);
          tBallSpeedY = deltaY * 0.35;
        } else {
          player1Score++; //must be before ball reset to calculate score before determining if ball should be reset
          resetBall();
        }
    }
    if (tBallX < 0) {
      if (tBallY > leftPaddleY &&
        tBallY < leftPaddleY + paddleHeight) {
          tBallSpeedX = -tBallSpeedX;

          var deltaY = tBallY - (leftPaddleY + paddleHeight/2);
          tBallSpeedY = deltaY * 0.35;
        } else {
          player2Score++;
          resetBall();
        }
    }
    if (tBallY > canvas.height) {
      tBallSpeedY = -tBallSpeedY;
    }
    if (tBallY < 0) {
      tBallSpeedY = -tBallSpeedY;
    }
}

function drawNet() {
  for(var i=0; i<canvas.height; i+=40) {
    colorRect(canvas.width/2-1,i,2,20, '#FFF'); //2: width, 20: height
  }
}

function drawEverything() {
  //canvas color
  colorRect(0, 0, canvas.width, canvas.height, '#239B56');

  if (displayWinScreen) {
    canvasContext.fillStyle = '#FFF';
  if (player1Score >= winningScore) {
    canvasContext.fillText("Left Player Won!", 350, 200);
  } else if (player2Score >= winningScore) {
    canvasContext.fillText("Right Player Won!", 350, 200);
  }
    canvasContext.fillText("Click to keep playing.", 350, 500);
    return;
  }
  drawNet();
  //left player's paddle
  colorRect(0, leftPaddleY, paddleThickness, paddleHeight, '#FFF');
  //right player's paddle
  colorRect(canvas.width-paddleThickness, rightPaddleY, paddleThickness, paddleHeight, '#FFF');
  //draws tBall
  colorCircle(tBallX, tBallY, 10, '#FFEB3B');
//score
  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width-100, 100);

}

function colorCircle(centerX, centerY, radius, drawColor) {
canvasContext.fillStyle = drawColor;
canvasContext.beginPath();
canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
