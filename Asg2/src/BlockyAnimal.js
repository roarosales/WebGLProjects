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
let g_legAngle = 0;
let g_Animation=false;
let g_AniPurple=false;

let g_awawaSpeed=5;

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

  document.getElementById('speedSlide').addEventListener('mousemove', function(){ g_awawaSpeed = this.value; tick();});
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
    g_yellowAngle = (-15 *Math.sin(g_awawaSpeed*g_seconds)); 
  }

  if(g_AniPurple){
    g_purpleAngle = (10 * Math.sin(g_awawaSpeed*g_seconds) + 10); //restricted jaw movement, AI helped with this
  }
  
  if(g_legAngle){ //it checks itself and resets to 0
    g_legAngle = (-5 *Math.sin(g_awawaSpeed*g_seconds)); 
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
  body.color = [38/255, 27/255, 13/255,1]; // have to divide by 255 to scale correctly
  body.matrix.translate(-.175, -.68, 0);
  body.matrix.rotate(0, 1, 0, 0);
  body.matrix.scale(1,.48,.5);
  body.render();

  //hyrax back
  var back = new Cube();
  back.color = [38/255, 27/255, 13/255,1];// have to divide by 255 to scale correctly
  back.matrix.translate(-.02, -.6, 0);
  back.matrix.rotate(0, 1, 0, 0);
  back.matrix.scale(.75,.48,.5);
  back.render();

  //hyrax left front foot
  var lfFoot = new Cube();
  lfFoot.color = [31/255, 22/255, 10/255,1];// have to divide by 255 to scale correctly
  lfFoot.matrix = new Matrix4(body.matrix); 
  lfFoot.matrix.translate(.05, -.3, 0.01);
  lfFoot.matrix.rotate(g_legAngle, 0, 0, 1);
  lfFoot.matrix.scale(.175,.5,.35);
  lfFoot.render();

  //hyrax right front foot
  var rfFoot = new Cube();
  rfFoot.color = [31/255, 22/255, 10/255,1];// have to divide by 255 to scale correctly
  rfFoot.matrix = new Matrix4(body.matrix); 
  rfFoot.matrix.translate(.05, -.3, .64);
  rfFoot.matrix.rotate(g_legAngle, 0, 0, 1);
  rfFoot.matrix.scale(.175,.5,.35);
  rfFoot.render();


  //hyrax left back foot
  var lbFoot = new Cube();
  lbFoot.color = [31/255, 22/255, 10/255,1];// have to divide by 255 to scale correctly
  lbFoot.matrix = new Matrix4(body.matrix); 
  lbFoot.matrix.translate(.76, -.3, 0.01);
  lbFoot.matrix.rotate(g_legAngle, 0, 0, 1);
  lbFoot.matrix.scale(.175,.5,.35);
  lbFoot.render();

  //hyrax right back foot
  var rbFoot = new Cube();
  rbFoot.color = [31/255, 22/255, 10/255,1];// have to divide by 255 to scale correctly
  rbFoot.matrix = new Matrix4(body.matrix); 
  rbFoot.matrix.translate(.76, -.3, .64);
  rbFoot.matrix.rotate(g_legAngle, 0, 0, 1);
  rbFoot.matrix.scale(.175,.5,.35);
  rbFoot.render();

  // Head of the Hyrax
  //head
  var head = new Cube();
  head.color = [48/255, 34/255,17/255,1];
  head.matrix.setTranslate(-.3, -.49, 0);
  head.matrix.rotate(g_yellowAngle, 0, 0, 1);
  var yellowCoordinatesMat = new Matrix4(head.matrix);
  head.matrix.scale(.38,.4,.48);
  head.matrix.translate(-.5, -.2, 0.01);
  head.render();

  //above head box
  var headbox = new Cube();
  headbox.color = [48/255, 34/255,17/255,1];
  headbox.matrix = new Matrix4(head.matrix); //for some reason yellowCoordinatesMat was sticking to jaw
  headbox.matrix.rotate(0, 0, 0, 1);
  headbox.matrix.scale(1.25,.175,1);
  headbox.matrix.translate(-.2, 5.7, 0.01);
  headbox.render();

  //left ear on head box
  var leftear = new Cube();
  leftear.color = [38/255, 27/255, 13/255,1];
  leftear.matrix = new Matrix4(head.matrix); //for some reason yellowCoordinatesMat was sticking to jaw
  leftear.matrix.rotate(-.25*g_legAngle, 0, 0, 1);
  leftear.matrix.scale(.3,.3,.28);
  leftear.matrix.translate(2.4, 3.5, -0.1);
  leftear.render();

  //right ear on head box
  var rightear = new Cube();
  rightear.color = [38/255, 27/255, 13/255,1];
  rightear.matrix = new Matrix4(head.matrix); //for some reason yellowCoordinatesMat was sticking to jaw
  rightear.matrix.rotate(-.25*g_legAngle, 0, 0, 1);
  rightear.matrix.scale(.3,.3,.28);
  rightear.matrix.translate(2.4, 3.5, 2.7);
  rightear.render();

  //above jaw box
  var headbox = new Cube();
  headbox.color = [48/255, 34/255,17/255,1];
  headbox.matrix = new Matrix4(head.matrix); //for some reason yellowCoordinatesMat was sticking to jaw
  headbox.matrix.rotate(0, 0, 0, 1);
  headbox.matrix.scale(.61,.45,1);
  headbox.matrix.translate(-1, .57, 0.01);
  headbox.render();

  //nose box
  var nosebox = new Cube();
  nosebox.color = [31/255, 22/255,11/255,1];
  nosebox.matrix = new Matrix4(head.matrix); //for some reason yellowCoordinatesMat was sticking to jaw
  nosebox.matrix.rotate(0, 0, 0, 1);
  nosebox.matrix.scale(.6,.42,.45);
  nosebox.matrix.translate(-1, 1, .65);
  nosebox.render();

  //nose
  var nose = new Cube();
  nose.color = [0,0,0,1];
  nose.matrix = new Matrix4(head.matrix); //for some reason yellowCoordinatesMat was sticking to jaw
  nose.matrix.rotate(0, 0, 0, 1);
  nose.matrix.scale(.6,.44,.42);
  nose.matrix.translate(-1.1, .8, .73);
  nose.render();

  //left eye
  var lefteye = new Cube();
  lefteye.color = [0,0,0,1];
  lefteye.matrix = new Matrix4(head.matrix); //for some reason yellowCoordinatesMat was sticking to jaw
  lefteye.matrix.rotate(0, 0, 0, 1);
  lefteye.matrix.scale(.3,.3,.28);
  lefteye.matrix.translate(-1, 2.34, 0);
  lefteye.render();

  //right eye
  var righteye = new Cube();
  righteye.color = [0,0,0,1];
  righteye.matrix = new Matrix4(head.matrix); //for some reason yellowCoordinatesMat was sticking to jaw
  righteye.matrix.rotate(0, 0, 0, 1);
  righteye.matrix.scale(.3,.3,.28);
  righteye.matrix.translate(-1, 2.34, 2.7);
  righteye.render();

  //left tooth
  var leftTooth = new Cube();
  leftTooth.color = [1,1,1,1];
  leftTooth.matrix = new Matrix4(head.matrix); //for some reason yellowCoordinatesMat was sticking to jaw
  leftTooth.matrix.rotate(0, 0, 0, 1);
  leftTooth.matrix.scale(.1,.3,.1);
  leftTooth.matrix.translate(-6, .4, 3);
  leftTooth.render();

  //right tooth
  var rightTooth = new Cube();
  rightTooth.color = [1,1,1,1];
  rightTooth.matrix = new Matrix4(head.matrix); //for some reason yellowCoordinatesMat was sticking to jaw
  rightTooth.matrix.rotate(0, 0, 0, 1);
  rightTooth.matrix.scale(.1,.3,.1);
  rightTooth.matrix.translate(-6, .4, 6.2);
  rightTooth.render();

  //Attached to head box
  //jaw box
  var jaw = new Cube();
  jaw.color = [48/255, 34/255,17/255,1];
  jaw.matrix = yellowCoordinatesMat;
  jaw.matrix.translate(0,0,0);
  jaw.matrix.rotate(g_purpleAngle, 0, 0, 1);
  jaw.matrix.scale(.53,.1,.48);
  jaw.matrix.translate(-.81, -.85, 0.01);
  jaw.render();

  //Tertiary attach to the jaw
  //tongue box
  var tongue = new Cube();
  tongue.color = [189/255, 83/255, 69/255, 1];
  tongue.matrix = new Matrix4(jaw.matrix); //attaching to the jaw
  jaw.matrix.translate(0,0,0);
  tongue.matrix.rotate(g_purpleAngle, 0, 0, 1);
  tongue.matrix.scale(.8,.2,.8);
  tongue.matrix.translate(.1, 4, .1);
  tongue.render();
  
  //The tail is a 3D triangle
  var tail = new RightTriangle3D();
  tail.color = [38/255, 27/255, 13/255,1]; // have to divide by 255 to scale correctly
  tail.matrix.translate(.9, -.6, .17);
  tail.matrix.rotate(270, 0, 1, 0);
  tail.matrix.scale(.15,.15,.15);
  tail.render();

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


//this tracks mouse movements
function mouseMove(ev){
  let [x,y]=convertCoordinatesEventToGL(ev); 
  g_globalAngleX = x*180;
  g_globalAngleY = y*180;
}


function main() {
  setupWebGL();
  connectVariableToGLSL();
  addActionsForHTMLUI();


  // Register function (event handler) to be called on a mouse press
  //canvas.onmousedown = click; //simplified to just click
  canvas.onmousemove = function(ev) {
    if(ev.buttons==1) { //if left click then we allow for mouse move
      mouseMove(ev);
    }
  };

  //ensures that if the mouse is down that both the mouth and head move
  canvas.onmousedown= function(ev){
    if (ev.shiftKey){
      g_Animation=!g_Animation; //originally had if statements but chatgpt showed me this better solution
      g_AniPurple = g_Animation;
      g_legAngle=g_Animation;//the legs/ear only animate with this special animation
    }
  }
  

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);

  //renderScene();

  requestAnimationFrame(tick);

}

