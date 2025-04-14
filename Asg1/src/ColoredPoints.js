// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

//This was done using most just the tutorial from the prof, I cited any AI generated lines.

var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n'+
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' + //setting the size
  '}\n';
//tried cleaning up but VS Code would only let it work as a single line which is harder to read

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

//making global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

//this stays the same for the rest of quarter
function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  //the magic flag!!
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true}); //makes it super fast

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariableToGLSL(){
 // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }
  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}
const POINT=0;
const TRIANGLE=1;
const CIRCLE=2;

const EQUAL=0;
const RIGHT=1;
const LEFT=2;
const ISOCELES=3;

//Global variables for UI
let g_selectedColor=[1.0,1.0,1.0,1.0]; //started as white by default
let g_selectedSize=5;
let g_selectedType=POINT;
let g_selectedSeg=10;

let g_selectedVarient=RIGHT;

var g_shapesList = []; //new list for points

//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes = []; //array for size


//from video 
function addActionsForHTMLUI(){
  //buttons for colors
  document.getElementById('green').onclick = function() { g_selectedColor = [0.0,1.0,0.0,1.0]; };
  document.getElementById('red').onclick = function() { g_selectedColor = [1.0,0.0,0.0,1.0]; };
  document.getElementById('clearButton').onclick = function() { g_shapesList = []; renderAllShapes(); }; 

  //buttons for shapes
  document.getElementById('point').onclick = function() { g_selectedType = POINT; };
  document.getElementById('triangle').onclick = function() { g_selectedType = TRIANGLE; };
  document.getElementById('circle').onclick = function() { g_selectedType = CIRCLE; };
  document.getElementById('eraser').onclick = function() { g_selectedColor = [0.0,0.0,0.0,1.0]; };

  //sliders for color
  document.getElementById('redSlide').addEventListener('mouseup', function(){ g_selectedColor[0] = this.value/100;});
  document.getElementById('greenSlide').addEventListener('mouseup', function(){ g_selectedColor[1] = this.value/100;});
  document.getElementById('blueSlide').addEventListener('mouseup', function(){ g_selectedColor[2] = this.value/100;});

   //slider for transparency
   document.getElementById('trSlide').addEventListener('mouseup', function(){ g_selectedColor[3] = this.value/100;});

  //slider for size
  document.getElementById('sizeSlide').addEventListener('mouseup', function(){ g_selectedSize = this.value;});

  //segment slide
  document.getElementById('segSlide').addEventListener('mouseup', function(){ g_selectedSeg = this.value;});

  //triangle varient
  document.getElementById('iTri').onclick = function() { g_selectedVarient = ISOCELES; };
  document.getElementById('rTri').onclick = function() { g_selectedVarient = RIGHT; };
  document.getElementById('lTri').onclick = function() { g_selectedVarient = LEFT; };
  document.getElementById('eTri').onclick = function() { g_selectedVarient = EQUAL; };
}

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return ([x,y]);
}

function renderAllShapes(){

  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  //var len = g_points.length;
  var len = g_shapesList.length;

  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
  var duration=performance.now()-startTime;
  sendTextToHTML(("numdot: " +len + " ms: "+ Math.floor(duration) +" fps: " +Math.floor(10000/duration)) , "numdot");
}

function sendTextToHTML(text,htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm){
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML=text;
}

function click(ev) {
  //Getting the WEBGL Coordinates
  let [x,y]=convertCoordinatesEventToGL(ev); //made it local
  var segments= g_selectedSeg; //using the selected segments
  var varient = g_selectedVarient;

  let point;
  if(g_selectedType==POINT){
    point = new Point();
  }
  else if(g_selectedType==TRIANGLE){
    point = new Triangle(varient);
  }
  else if(g_selectedType==CIRCLE){
    point = new Circle(segments);
  }
  point.position=[x,y];
  point.color=g_selectedColor.slice();
  point.size=g_selectedSize;
  g_shapesList.push(point);

  // Store the coordinates to g_points array
  //g_points.push([x, y]);
  //g_colors.push(g_selectedColor.slice( )); // need the slice for the points to not all change
  //g_sizes.push(g_selectedSize);

  // Store the coordinates to g_points array
  /* if (x >= 0.0 && y >= 0.0) {      // First quadrant
    g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  } else if (x < 0.0 && y < 0.0) { // Third quadrant
    g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  } else {                         // Others
    g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  }
  */
 
  renderAllShapes();
}


function main() {
  setupWebGL();
  connectVariableToGLSL();
  addActionsForHTMLUI();


  //There are two functions for transparency, chatgpt helped here
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click; //simplified to just click
  canvas.onmousemove = function(ev) {if(ev.buttons==1) {click(ev)}};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}