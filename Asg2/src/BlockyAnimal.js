// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

//This was done using most just the tutorial from the prof, I cited any AI generated lines.

var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n'+
  'uniform mat4 u_GlobalRotateMatrix;'+
  'void main() {\n' +
  '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
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
let u_ModelMatrix;
let u_GlobalRotateMatrix;

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

  gl.enable(gl.DEPTH_TEST);
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

  //Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  //Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}
const POINT=0;
const TRIANGLE=1;
const CIRCLE=2;


//Global variables for UI
let g_selectedColor=[1.0,1.0,1.0,1.0]; //started as white by default
let g_selectedSize=5;
let g_selectedType=POINT;
let g_selectedSeg=10;


//Environment angles
let g_globalAngleX = 0;
let g_globalAngleY = 0;


let g_yellowAngle = 0;
let g_purpleAngle = 0;
let g_Animation=false;
let g_AniPurple=false;

var g_shapesList = []; //new list for points

//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes = []; //array for size


//from video 
function addActionsForHTMLUI(){
  document.getElementById('angleSlideX').addEventListener('mousemove', function(){ g_globalAngleX = this.value; renderScene();});
  document.getElementById('angleSlideY').addEventListener('mousemove', function(){ g_globalAngleY = this.value; renderScene();});


  document.getElementById('yellowSlide').addEventListener('mousemove', function(){ g_yellowAngle = this.value; renderScene();});
  document.getElementById('purpleSlide').addEventListener('mousemove', function(){ g_purpleAngle = this.value; renderScene();});

  document.getElementById('animationButtonOn').onclick = function() { g_Animation = true; };
  document.getElementById('animationButtonOff').onclick = function() { g_Animation = false; };

  document.getElementById('aniPurpleON').onclick = function() { g_AniPurple = true; };
  document.getElementById('aniPurpleOFF').onclick = function() { g_AniPurple = false; };
}

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return ([x,y]);
}

var g_startTime=performance.now()/1000;
var g_seconds = performance.now()/1000-g_startTime;

function tick(){
  g_seconds = performance.now()/1000-g_startTime;
  console.log(g_seconds);

  updateAnimationAngles();
  renderScene();

  requestAnimationFrame(tick);
}

function updateAnimationAngles(){
  if(g_Animation){
    g_yellowAngle = (45*Math.sin(g_seconds)); //wavin arm
  }

  if(g_AniPurple){
    g_purpleAngle = (45*Math.sin(3*g_seconds)); //wavin head
  }
}

//renderScene()
function renderScene(){

  var startTime = performance.now();

  var globalRotMat = new Matrix4().rotate(g_globalAngleX,0,1,0) //horizontal rotation
  globalRotMat.rotate(g_globalAngleY,1,0,0);
  
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);


  //hyrax body 
  var body = new Cube();
  body.color = [61/255, 43/255, 0/255, 1] // have to divide by 255 to scale correctly
  body.matrix.translate(-.25,-.75,0.0);
  body.matrix.rotate(0, 1, 0, 0);
  body.matrix.scale(1,.5,.5);
  body.render();

  //head
  var leftArm = new Cube();
  leftArm.color = [1,1,0,1];
  leftArm.matrix.setTranslate(-.3, -.49, 0);
  leftArm.matrix.rotate(g_yellowAngle, 0, 0, 1);
  var yellowCoordinatesMat = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(.49,.4,.48);
  leftArm.matrix.translate(-.5, 0, 0.01);
  leftArm.render();

  //jaw box
  var box = new Cube();
  box.color = [1,0,1,1];
  box.matrix = yellowCoordinatesMat;
  box.matrix.translate(0,0,0);
  box.matrix.rotate(g_purpleAngle, 0, 0, 1);
  box.matrix.scale(.2,.15,.48);
  box.matrix.translate(-2.2, 0, 0.01);
  box.render();

  var duration=performance.now()-startTime;
  sendTextToHTML(( " ms: "+ Math.floor(duration) +" fps: " +Math.floor(10000/duration)) , "numdot");
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

}

function main() {
  setupWebGL();
  connectVariableToGLSL();
  addActionsForHTMLUI();


  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click; //simplified to just click
  canvas.onmousemove = function(ev) {if(ev.buttons==1) {click(ev)}};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);

  //renderScene();

  requestAnimationFrame(tick);

}

