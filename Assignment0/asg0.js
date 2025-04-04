// DrawTriangle.js (c) 2012 matsuda



//I'm unfamiliar with JS and this guide helped me make the line
//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo


function main() {  
  // Retrieve <canvas> element
  var canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  var ctx = canvas.getContext('2d');

  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Setting canvas height and width
  
  //let v1 = new Vector3([2.25, 2.25,0]);
  //drawVector(v1,"red");
}

function drawVector(v1,color){
  var canvas = document.getElementById('example');  
  var ctx = canvas.getContext('2d'); 

  ctx.beginPath(); 
  ctx.moveTo(200, 200); //set at center
  ctx.lineTo(200 + (20*v1.elements[0]), 200 - (20*v1.elements[1])); //scale line by 20, chat gpt helped with 200+ and -200

  ctx.strokeStyle = color; //setting color to red
  ctx.stroke(); 
}

function handleDrawEvent(){
  var canvas = document.getElementById('example');  
  var ctx = canvas.getContext('2d'); 

  //set to blank canvas
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Setting canvas height and width

  let x1 = document.getElementById("v1x").value;
  let y1 = document.getElementById("v1y").value;
  let x2 = document.getElementById("v2x").value;
  let y2 = document.getElementById("v2y").value;

  let v1 = new Vector3([x1, y1, 0]);
  let v2 = new Vector3([x2, y2, 0]);

  drawVector(v1,"red");
  drawVector(v2,"blue");
}

