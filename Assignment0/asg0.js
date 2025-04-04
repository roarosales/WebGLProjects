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

  // Part 1 & 2: Making a black square and red vector
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Setting canvas height and width
  
  //let v1 = new Vector3([2.25, 2.25,0]);
  //drawVector(v1,"red");
}

//Part 2
function drawVector(v1,color){
  //setting up canvas and ctx
  var canvas = document.getElementById('example'); 
  var ctx = canvas.getContext('2d'); 

  ctx.beginPath(); 
  ctx.moveTo(200, 200); //set at center
  ctx.lineTo(200 + (20*v1.elements[0]), 200 - (20*v1.elements[1])); //scale line by 20, chat gpt helped with 200+ and -200

  ctx.strokeStyle = color; //setting color to red
  ctx.stroke(); 
}

function handleDrawEvent(){
  //setting up canvas and ctx
  var canvas = document.getElementById('example');  
  var ctx = canvas.getContext('2d'); 

  //set to blank canvas
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Setting canvas height and width

  //Part 3 and 4
  //Getting my elements from html
  let x1 = document.getElementById("v1x").value;
  let y1 = document.getElementById("v1y").value;
  let x2 = document.getElementById("v2x").value;
  let y2 = document.getElementById("v2y").value;

  //Setting up original vectors
  let v1 = new Vector3([x1, y1, 0]);
  let v2 = new Vector3([x2, y2, 0]);
 
  drawVector(v1,"red");
  drawVector(v2,"blue");

  //Part 5
  //Addition
  if(document.getElementById("operation-select").value == "Add"){
    v3=v1.add(v2);
    drawVector(v3,"green");
  }

  //Subtraction
  if(document.getElementById("operation-select").value == "Subtract"){
    v3=v1.sub(v2);
    drawVector(v3,"green");
  }

  //Multiplication
  if(document.getElementById("operation-select").value == "Multiply"){
    v3=v1.mul(document.getElementById("Scalar").value);
    v4=v2.mul(document.getElementById("Scalar").value);
    drawVector(v3,"green");
    drawVector(v4,"green");
  }

  //Division
  if(document.getElementById("operation-select").value == "Divide"){
    v3=v1.div(document.getElementById("Scalar").value);
    v4=v2.div(document.getElementById("Scalar").value);
    drawVector(v3,"green");
    drawVector(v4,"green");
  }

  //Part 6
  //Magnitude
  if(document.getElementById("operation-select").value == "Magnitude"){
    console.log("Magnitude v1: " + v1.magnitude());
    console.log("Magnitude v2: " + v2.magnitude());
  }

  //Normalize
  if(document.getElementById("operation-select").value == "Normalize"){
    v3= v1.normalize();
    v4= v2.normalize();
    drawVector(v3,"green");
    drawVector(v4,"green");
  }    

  //Part 7
  //Angle Between
  if(document.getElementById("operation-select").value == "Angle Between"){
    console.log("Angle:" + angleBetween(v1,v2));
  }    

  //Part 8 
  // Area of triangle
  if(document.getElementById("operation-select").value == "Area"){
    console.log("Area of Triangle:" + areaTriangle(v1,v2));
  }
}

//Part 7
//Angle Between Function
function angleBetween(v1,v2){
  let angle = Vector3.dot(v1,v2) / (v1.magnitude()*v2.magnitude()); // got formula from https://www.cuemath.com/geometry/angle-between-vectors/
  return Math.acos(angle) * (180/Math.PI); // converting from radiants to degree, chatgpt helped here cause I forgot lol
}

//Part 8 
//Area of Triangle Function
function areaTriangle(v1,v2){
  area =  Vector3.cross(v1,v2).magnitude() * (.5); //get the magnitude of cross product and then divide by 2 cause triangle area
  return area;
}