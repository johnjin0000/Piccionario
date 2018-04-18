let color = 'black';
let isOverRedButton;
let isOverBlueButton;
let isOverBlackButton;
let isOverEraserButton;
let isOverGreenButton;
let isOverYellowButton;




function setup() {
  var canvas = createCanvas(700, 500);
  canvas.parent('sketch');
  background(255);
  // We make a named event called 'mouse' and write an
  // anonymous callback function
  socket.on('mouse',
    // When we receive data
    function(data) {
      if(data.y < 400){
        fill(data.color);
        noStroke();
        ellipse(data.x, data.y, 30, 30);
      }
    });

  socket.on('clearCanvas', function(){
    background(255);
  });
}

function draw() {
//HOVER FUNCTION
  if(isOverRedButton||isOverBlueButton||isOverBlackButton||isOverEraserButton||isOverGreenButton||isOverYellowButton)
  {
    stroke(150);
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
//RED
  if (mouseX >= 50 && mouseX <= 50+50 && mouseY >= 450 && mouseY <= 450+50)
  {
    isOverRedButton = true;
  } else {
    isOverRedButton = false;
  }

  rectMode(CORNER);
  stroke(0);
  strokeWeight(3);
  fill('red');
  rect(50, 450, 50, 50);

  //BLUE
  if (mouseX >= 100 && mouseX <= 100+50 && mouseY >= 450 && mouseY <= 450+50)
  {
    isOverBlueButton = true;
  } else {
    isOverBlueButton = false;
  }
  stroke(0);
  fill('blue');
  rect(100, 450, 50, 50);

  //black
  if (mouseX >= 150 && mouseX <= 150+50 && mouseY >= 450 && mouseY <= 450+50)
  {
    isOverBlackButton = true;
  } else {
    isOverBlackButton = false;
  }
  stroke(0);
  fill('black');
  rect(150, 450, 50, 50);

  //ERASER

  if (mouseX >= 200 && mouseX <= 200+50 && mouseY >= 450 && mouseY <= 450+50)
  {
    isOverEraserButton = true;
  } else {
    isOverEraserButton = false;
  }
  stroke(0);
  fill('white');
  rect(200, 450, 50, 50);

  //green
  if (mouseX >= 250 && mouseX <= 250+50 && mouseY >= 450 && mouseY <= 450+50)
  {
    isOverGreenButton = true;
  } else {
    isOverGreenButton = false;
  }
  stroke(0);
  fill('green');
  rect(250, 450, 50, 50);

  //yellow
  if (mouseX >= 300 && mouseX <= 300+50 && mouseY >= 450 && mouseY <= 450+50)
  {
    isOverYellowButton = true;
  } else {
    isOverYellowButton = false;
  }
  stroke(0);
  fill('yellow');
  rect(300, 450, 50, 50);
}

function mousePressed(){

  if(isOverRedButton){
    color = 'red';
  }
  if(isOverBlueButton){
    color = 'blue';
  }
  if(isOverBlackButton){
    color = 'black';
  }
  if(isOverEraserButton){
    color = 'white';
  }
  if(isOverGreenButton){
    color = 'green';
  }
  if(isOverYellowButton){
    color = 'yellow';
  }

}

function mouseDragged() {
  fill(color);
  noStroke();
  if(mouseY < 400){
    ellipse(mouseX,mouseY,30,30);
    // Send the mouse coordinates
    sendmouse(mouseX,mouseY,color);
  }
}

// Function for sending to the socket
function sendmouse(xpos, ypos, mColor) {

  var data = {
    x: xpos,
    y: ypos,
    color: mColor
  };

  // Send that object to the socket
  socket.emit('mouse',data);
}
