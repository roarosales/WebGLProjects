// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

//This was done using most just the tutorial from the prof, I cited any AI generated lines.

var VSHADER_SOURCE =
  'precision mediump float;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_UV;\n' +
  'attribute vec3 a_Normal;\n' +
  'varying vec2 v_UV;\n'+
  'varying vec3 v_Normal;\n'+
  'varying vec4 v_VertPos;\n'+
  'uniform mat4 u_ModelMatrix;\n'+
  'uniform mat4 u_GlobalRotateMatrix;'+
  'uniform mat4 u_ViewMatrix;\n'+
  'uniform mat4 u_ProjectionMatrix;\n'+
  'void main() {\n' +
  ' gl_Position = u_ProjectionMatrix* u_ViewMatrix* u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  ' v_UV = a_UV;\n'+ 
  ' v_Normal = a_Normal;\n'+ 
  ' v_VertPos = u_ModelMatrix * a_Position;\n'+ 
  '}\n';
//tried cleaning up but VS Code would only let it work as a single line which is harder to read

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec2 v_UV;\n' +  
  'varying vec3 v_Normal;\n' + 
  'uniform vec3 u_lightColor;\n' + 
  'uniform vec4 u_FragColor;\n' +  
  'uniform sampler2D u_Sampler0;\n' +  
  'uniform sampler2D u_Sampler1;\n' + 
  'uniform sampler2D u_Sampler2;\n' + 
  'uniform int u_WhichTexture;\n' +
  'uniform vec3 u_lightPos;\n' +
  'uniform vec3 u_cameraPos;\n' +
  'varying vec4 v_VertPos;\n' + 
  'uniform bool u_lightOn;\n' + 
  'void main() {\n' +
  ' if(u_WhichTexture == -3){ \n' +
  '   gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0); \n' +
  ' }\n'+
  ' else if(u_WhichTexture == -2){ \n' +
  '   gl_FragColor = u_FragColor; \n' +
  ' }\n'+
  ' else if(u_WhichTexture == -1){ \n' +
  '   gl_FragColor = vec4(v_UV, 1.0,1.0); \n' +
  ' }\n'+
  ' else if(u_WhichTexture == 0){\n'+
  '   gl_FragColor = texture2D(u_Sampler0, v_UV);\n'+
  ' }\n' +
  ' else if(u_WhichTexture == 1){\n'+
  '   gl_FragColor = texture2D(u_Sampler1, v_UV);\n'+
  ' }\n' +
  ' else if(u_WhichTexture == 2){\n'+
  '   gl_FragColor = texture2D(u_Sampler2, v_UV);\n'+
  ' }\n' +
  ' else{ // puts reddish if error \n'+
  '   gl_FragColor = vec4(1,.2,.2,1);\n'+
  ' }\n'+
  ' \n'+
  ' vec3 lightVector = u_lightPos-vec3(v_VertPos);\n' + 
  ' float r = length(lightVector);\n' + 
  ' //visualizing red/green on stuff\n'+
  ' //if (r<1.0){\n'+
  ' //  gl_FragColor = vec4(1,0,0,1); \n'+
  ' //}\n'+
  ' //else if (r<2.0){\n'+
  ' //  gl_FragColor = vec4(0,1,0,1);\n'+
  ' //}\n'+
  ' //gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1);\n'+
  ' //N dot L code instead of the if statements\n'+
  ' vec3 L = normalize(lightVector);\n'+
  ' vec3 N = normalize(v_Normal);\n'+
  ' float nDotL = max(dot(N,L), 0.0);\n'+
  ' \n'+
  ' vec3 R = reflect(-L, N); //reflection vector\n'+
  ' vec3 E = normalize(u_cameraPos)-vec3(v_VertPos); // eye vector\n'+
  ' \n'+
  ' float specular = pow(max(dot(E,R),0.0), 10.0);\n'+
  ' \n'+
  ' vec3 diffuse = vec3(gl_FragColor) * nDotL * u_lightColor;\n'+
  ' vec3 ambient = vec3(gl_FragColor) * 0.3;\n'+
  ' //gl_FragColor = vec4(specular+diffuse+ambient, 1.0);\n'+
  ' if(u_lightOn){\n'+
  '   if(u_WhichTexture==0){\n'+
  '     gl_FragColor = vec4(specular+diffuse+ambient, 1.0);\n'+
  '   }\n'+
  '   else{\n'+
  '     gl_FragColor = vec4(diffuse+ambient, 1.0);\n'+
  '   }\n'+
  '  }\n'+
  '}\n';

//Making global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

//Additional global variables for asgn 3
let a_UV;
let a_Normal;
let u_Size;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_WhichTexture; // decides if texture or not

//Sampler Variables
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;

let u_lightPos;
let u_cameraPos;
let u_lightOn;

let u_lightColor;

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
  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal<0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV<0) {
    console.log('Failed to get the storage location of a_UV');
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
  //Storage location of size
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  //Storage location of ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }
  
  u_WhichTexture = gl.getUniformLocation(gl.program, 'u_WhichTexture');
  if (!u_WhichTexture) {
    console.log('Failed to get the storage location of u_WhichTexture');
    return;
  }
  
  
  //Storage location of first texture
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }
  //Storage location of second texture
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }
  //Storage location of third texture
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return;
  }
  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }
  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }
  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }
  u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
  if (!u_lightColor) {
    console.log('Failed to get the storage location of u_lightColor');
    return;
  }

  //Storage location of size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
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

//stuck for asg 4
let g_normalOn=false;
let g_lightPos=[0,1,-2];
let g_lightOn = true;
let g_moveOn = true;

let g_lightColor = [1,1,1];

//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes = []; //array for size


//from video 
function addActionsForHTMLUI(){
  document.getElementById('normalOn').onclick = function() { g_normalOn = true; };
  document.getElementById('normalOff').onclick = function() { g_normalOn = false; };

  document.getElementById('lightOn').onclick = function() { g_lightOn = true; };
  document.getElementById('lightOff').onclick = function() { g_lightOn = false; };

  document.getElementById('moveOn').onclick = function() { g_moveOn = true; };
  document.getElementById('moveOff').onclick = function() { g_moveOn = false; };

  document.getElementById('lightSlideX').addEventListener('mousemove', function(){ g_lightPos[0] = this.value/100; renderScene();});
  document.getElementById('lightSlideY').addEventListener('mousemove', function(){ g_lightPos[1] = this.value/100; renderScene();});
  document.getElementById('lightSlideZ').addEventListener('mousemove', function(){ g_lightPos[2] = this.value/100; renderScene();});

  document.getElementById('lightColorR').addEventListener('mousemove', function(){ g_lightColor[0] = this.value/255; renderScene();});
  document.getElementById('lightColorG').addEventListener('mousemove', function(){ g_lightColor[1] = this.value/255; renderScene();});
  document.getElementById('lightColorB').addEventListener('mousemove', function(){ g_lightColor[2] = this.value/255; renderScene();});

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
  //console.log(g_seconds);

  updateAnimationAngles();
  renderScene();

  requestAnimationFrame(tick);
}

function updateAnimationAngles(){
  if(g_Animation){
    g_yellowAngle = (-5 *Math.sin(g_awawaSpeed*g_seconds)); 
  }

  if(g_AniPurple){
    g_purpleAngle = (5 * Math.sin(g_awawaSpeed*g_seconds) + 10); //restricted jaw movement, AI helped with this
  }
  
  if(g_legAngle){ //it checks itself and resets to 0
    g_legAngle = (-5 *Math.sin(g_awawaSpeed*g_seconds)); 
  }

  if(g_moveOn){
    g_lightPos[0]=-2.3*Math.cos(g_seconds);
  }
  //for the light moving on its own
  

}

// I used Vertex AI to comment this matrix initially, but I created the matrix, modified the values and comments to make sense
//All the comments with references to chambers were made by AI
//I manually entered all the values for the terrain
var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
];


//var g_eye = [0,1,3];
//var g_at = [0,0,-100];
//var g_up = [0,1,0];

//renderScene()
function renderScene(){
  var startTime = performance.now();

  var projMat = new Matrix4();
  //projMat.setPerspective(50, canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, camera.projectionMatrix.elements);
  //gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  //viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMatrix.elements);

  //console.log(camera.viewMatrix.elements)
  //gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAngleX,0,1,0) //horizontal rotation
  globalRotMat.rotate(g_globalAngleY,1,0,0);
  
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  //Generating the map
  for(x=0;x<8;x++){
    for(y=0;y<8;y++){
      if(g_map[x][y]==1){ // back wall
        var body = new Cube();
        body.color = [1,1,1,1];
        body.textureNum = 0;
        if (g_normalOn){
          body.textureNum = -3;
        }
        body.matrix.scale(1,1,1);
        body.matrix.translate(x-4, 0, y-4);
        body.render();

        var body1 = new Cube();
        body1.color = [1,1,1,1];
        body1.textureNum = 2;
        if (g_normalOn){
          body1.textureNum = -3;
        }
        body1.matrix.scale(1,2,1);
        body1.matrix.translate(x-4, .5, y-4);
        body1.render();
      }
      if(g_map[x][y]==2){ 
        var body = new Cube();
        body.color = [1,1,1,1];
        body.textureNum = 0;
        if (g_normalOn){
          body.textureNum = -3;
        }
        body.matrix.scale(1,1,1);
        body.matrix.translate(x-4, 0, y-3);
        body.render();
      }
      if(g_map[x][y]==3){
        var body = new Cube();
        body.color = [1,1,1,1];
        body.textureNum = 0;
        if (g_normalOn){
          body.textureNum = -3;
        }
        body.matrix.scale(1,1,1);
        body.matrix.translate(x-4, 0, y-4);
        body.render();
      }
    }
  }
  
  
  //sky box 
  var skybox = new Cube();
  skybox.color = [64/255, 64/255, 64/255, 1]; // have to divide by 255 to scale correctly
  skybox.textureNum = -2;
  if (g_normalOn){
    skybox.textureNum = -3;
  }
  skybox.matrix.scale(8,4,8);
  skybox.matrix.translate(-.5, -.25, -.5);
  skybox.render();


  //floor cube 
  var floor = new Cube();
  floor.color = [51/255, 51/255, 51/255,1]; // have to divide by 255 to scale correctly
  floor.textureNum = 1;
  if (g_normalOn){
    floor.textureNum = -3;
  }
  floor.repeatVal = 8;
  floor.matrix.translate(0, 0, 0);
  floor.matrix.scale(8,0,8);
  floor.matrix.translate(-.5, -1.8, -.5);
  floor.render();

  //sphere
  var round = new Sphere();
  round.color = [1, 0, 0,1];
  if (g_normalOn){
    round.textureNum = -3;
  }
  round.matrix.scale(.75,.75,.75);
  round.matrix.translate(.5,1,-2.4);
  round.render();

  //passing light position to glsl
  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

  //passing camera position to glsl
  gl.uniform3f(u_cameraPos, camera.eye.x, camera.eye.y, camera.eye.z);

  //light colour
  gl.uniform1i(u_lightOn, g_lightOn);

  //passing the light colour
  gl.uniform3f(u_lightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);

  //light cube
  var light = new Cube();
  light.color=[2,2,0,1];
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-.1,-.1,-.1);
  light.render();

  //#region Hyrax
  // Generating Hyrax 1
  var hyraxMatrix1 = new Matrix4();
  //hyraxMatrix1.scale(.5,.5,.5);
  hyraxMatrix1.translate(-2,.15,-1);
  hyraxMatrix1.rotate(135, 0, 1, 0);

  //hyrax1 body 
  var body = new Cube();
  body.matrix= new Matrix4(hyraxMatrix1);
  body.color = [38/255, 27/255, 13/255,1]; // have to divide by 255 to scale correctly
  if (g_normalOn){
    body.textureNum = -3;
  }
  body.matrix.translate(-.175, 0, 0);
  body.matrix.rotate(0, 0, 1, 0);
  body.matrix.scale(1,.48,.5);
  body.render();

  //hyrax back
  var back = new Cube();
  back.matrix = new Matrix4(body.matrix); 
  back.color = [38/255, 27/255, 13/255,1];// have to divide by 255 to scale correctly
  if (g_normalOn){
    back.textureNum = -3
  }
  back.matrix.translate(.165, 0, 0);
  back.matrix.rotate(0, 1, 0, 0);
  back.matrix.scale(.75, 1.1, 1);
  back.render();

  //hyrax left front foot
  var lfFoot = new Cube();
  lfFoot.color = [31/255, 22/255, 10/255,1];// have to divide by 255 to scale correctly
  if (g_normalOn){
    lfFoot.textureNum = -3
  }
  lfFoot.matrix = new Matrix4(body.matrix); 
  lfFoot.matrix.translate(.05, -.3, 0.01);
  lfFoot.matrix.rotate(g_legAngle, 0, 0, 1);
  lfFoot.matrix.scale(.175,.5,.35);
  lfFoot.render();

  //hyrax right front foot
  var rfFoot = new Cube();
  rfFoot.color = [31/255, 22/255, 10/255,1];// have to divide by 255 to scale correctly
  if (g_normalOn){
    rfFoot.textureNum = -3
  }
  rfFoot.matrix = new Matrix4(body.matrix); 
  rfFoot.matrix.translate(.05, -.3, .64);
  rfFoot.matrix.rotate(g_legAngle, 0, 0, 1);
  rfFoot.matrix.scale(.175,.5,.35);
  rfFoot.render();


  //hyrax left back foot
  var lbFoot = new Cube();
  lbFoot.color = [31/255, 22/255, 10/255,1];// have to divide by 255 to scale correctly
  if (g_normalOn){
    lbFoot.textureNum = -3
  }
  lbFoot.matrix = new Matrix4(body.matrix); 
  lbFoot.matrix.translate(.76, -.3, 0.01);
  lbFoot.matrix.rotate(g_legAngle, 0, 0, 1);
  lbFoot.matrix.scale(.175,.5,.35);
  lbFoot.render();

  //hyrax right back foot
  var rbFoot = new Cube();
  rbFoot.color = [31/255, 22/255, 10/255,1];// have to divide by 255 to scale correctly
  if (g_normalOn){
    rbFoot.textureNum = -3
  }
  rbFoot.matrix = new Matrix4(body.matrix); 
  rbFoot.matrix.translate(.76, -.3, .64);
  rbFoot.matrix.rotate(g_legAngle, 0, 0, 1);
  rbFoot.matrix.scale(.175,.5,.35);
  rbFoot.render();

  // Head of the Hyrax
  //head
  var head = new Cube();
  head.matrix = new Matrix4(body.matrix); 
  head.color = [48/255, 34/255,17/255,1];
  if (g_normalOn){
    head.textureNum = -3
  }
  head.matrix.rotate(g_yellowAngle, 0, 0, 1);
  var yellowCoordinatesMat = new Matrix4(head.matrix);
  head.matrix.scale(.35,.75,.9);
  head.matrix.translate(-.8, .34, 0.01);
  head.render();

  //above head box
  var abHeadbox = new Cube();
  abHeadbox.color = [48/255, 34/255,17/255,1];
  if (g_normalOn){
    abHeadbox.textureNum = -3
  }
  abHeadbox.matrix = new Matrix4(head.matrix); //for some reason yellowCoordinatesMat was sticking to jaw
  abHeadbox.matrix.rotate(0, 0, 0, 1);
  abHeadbox.matrix.scale(1.25,.175,1);
  abHeadbox.matrix.translate(-.2, 5.7, 0.01);
  abHeadbox.render();

  //left ear on head box
  var leftear = new Cube();
  leftear.color = [38/255, 27/255, 13/255,1];
  if (g_normalOn){
    leftear.textureNum = -3
  }
  leftear.matrix = new Matrix4(head.matrix); //for some reason yellowCoordinatesMat was sticking to jaw
  leftear.matrix.rotate(-.25*g_legAngle, 0, 0, 1);
  leftear.matrix.scale(.3,.3,.28);
  leftear.matrix.translate(2.4, 3.5, -0.1);
  leftear.render();

  //right ear on head box
  var rightear = new Cube();
  rightear.color = [38/255, 27/255, 13/255,1];
  if (g_normalOn){
    rightear.textureNum = -3
  }
  rightear.matrix = new Matrix4(head.matrix); //for some reason yellowCoordinatesMat was sticking to jaw
  rightear.matrix.rotate(-.25*g_legAngle, 0, 0, 1);
  rightear.matrix.scale(.3,.3,.28);
  rightear.matrix.translate(2.4, 3.5, 2.7);
  rightear.render();

  //above jaw box
  var abJawBox = new Cube();
  abJawBox.color = [48/255, 34/255,17/255,1];
  if (g_normalOn){
    abJawBox.textureNum = -3
  }
  abJawBox.matrix = new Matrix4(head.matrix); //for some reason yellowCoordinatesMat was sticking to jaw
  abJawBox.matrix.rotate(0, 0, 0, 1);
  abJawBox.matrix.scale(.61,.45,1);
  abJawBox.matrix.translate(-1, .57, 0.01);
  abJawBox.render();

  //nose box
  var nosebox = new Cube();
  nosebox.color = [31/255, 22/255,11/255,1];
  if (g_normalOn){
    nosebox.textureNum = -3
  }
  nosebox.matrix = new Matrix4(head.matrix); //for some reason yellowCoordinatesMat was sticking to jaw
  nosebox.matrix.rotate(0, 0, 0, 1);
  nosebox.matrix.scale(.6,.42,.45);
  nosebox.matrix.translate(-1, 1, .65);
  nosebox.render();

  //nose
  var nose = new Cube();
  nose.color = [0,0,0,1];
  if (g_normalOn){
    nose.textureNum = -3
  }
  nose.matrix = new Matrix4(head.matrix); //for some reason yellowCoordinatesMat was sticking to jaw
  nose.matrix.rotate(0, 0, 0, 1);
  nose.matrix.scale(.6,.44,.42);
  nose.matrix.translate(-1.1, .8, .73);
  nose.render();

  //left eye
  var lefteye = new Cube();
  lefteye.color = [0,0,0,1];
  if (g_normalOn){
    lefteye.textureNum = -3
  }
  lefteye.matrix = new Matrix4(head.matrix); //for some reason yellowCoordinatesMat was sticking to jaw
  lefteye.matrix.rotate(0, 0, 0, 1);
  lefteye.matrix.scale(.3,.3,.28);
  lefteye.matrix.translate(-1, 2.34, 0);
  lefteye.render();

  //right eye
  var righteye = new Cube();
  righteye.color = [0,0,0,1];
  if (g_normalOn){
    righteye.textureNum = -3
  }
  righteye.matrix = new Matrix4(head.matrix); //for some reason yellowCoordinatesMat was sticking to jaw
  righteye.matrix.rotate(0, 0, 0, 1);
  righteye.matrix.scale(.3,.3,.28);
  righteye.matrix.translate(-1, 2.34, 2.7);
  righteye.render();

  //left tooth
  var leftTooth = new Cube();
  leftTooth.color = [1,1,1,1];
  if (g_normalOn){
    leftTooth.textureNum = -3
  }
  leftTooth.matrix = new Matrix4(head.matrix); //for some reason yellowCoordinatesMat was sticking to jaw
  leftTooth.matrix.rotate(0, 0, 0, 1);
  leftTooth.matrix.scale(.1,.3,.1);
  leftTooth.matrix.translate(-6, .4, 3);
  leftTooth.render();

  //right tooth
  var rightTooth = new Cube();
  rightTooth.color = [1,1,1,1];
  if (g_normalOn){
    rightTooth.textureNum = -3
  }
  rightTooth.matrix = new Matrix4(head.matrix); //for some reason yellowCoordinatesMat was sticking to jaw
  rightTooth.matrix.rotate(0, 0, 0, 1);
  rightTooth.matrix.scale(.1,.3,.1);
  rightTooth.matrix.translate(-6, .4, 6.2);
  rightTooth.render();

  //Attached to head box
  //jaw box
  var jaw = new Cube();
  jaw.color = [48/255, 34/255,17/255,1];
  if (g_normalOn){
    jaw.textureNum = -3
  }
  jaw.matrix = new Matrix4(head.matrix); ;
  jaw.matrix.translate(0,0,0);
  jaw.matrix.rotate(g_purpleAngle, 0, 0, 1);
  jaw.matrix.scale(1,.24,1);
  jaw.matrix.translate(-.62, 0, 0.01);
  jaw.render();

  //Tertiary attach to the jaw
  //tongue box
  var tongue = new Cube();
  tongue.color = [189/255, 83/255, 69/255, 1];
  if (g_normalOn){
    tongue.textureNum = -3
  }
  tongue.matrix = new Matrix4(jaw.matrix); //attaching to the jaw
  jaw.matrix.translate(0,0,0);
  tongue.matrix.rotate(g_purpleAngle, 0, 0, 1);
  tongue.matrix.scale(.8,.2,.8);
  tongue.matrix.translate(.1, 4, .1);
  tongue.render();
  

  //#endregion
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

// Controlling Controls

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

}

//this tracks mouse movements
function mouseMove(ev){
  let [x,y]=convertCoordinatesEventToGL(ev); 
  g_globalAngleX = x*60;
  //for y I restricted downward moving to limit clipping
  let minY = -10; //chatgpt helped with this
  let maxY = 60;  //chatgpt helped with this
  g_globalAngleY = Math.max(minY, Math.min(y * 60, maxY)); //chatgpt generated this line for clamping the angles
}

function keydown(ev){
  if (ev.keyCode ==65){ // a key
    camera.moveLeft();
  }
  else if(ev.keyCode==68){ // d key
    camera.moveRight();
  }
  else if(ev.keyCode==87){ // w key
    camera.moveForward();
  }
  else if(ev.keyCode==83){ // s key
    camera.moveBackward();
  }
  else if(ev.keyCode==81){ // q key
    g_globalAngleX -= 5;
  }
  else if(ev.keyCode==69){ // e key
    g_globalAngleX += 5;
  }
  else if(ev.keyCode==70){ // f key non-functional tho
    placeBlock();
  }
  renderScene();
  console.log(ev.keyCode);
}

function initTextures(){

  var image0= new Image();
  var image1= new Image();
  var image2= new Image();
  if(!image0 || !image1 || !image2){
    console.log('Failed to create the image object');
    return false;
  }

  image0.onload=function(){ sendTextureToTEXTURE0(image0);};
  image1.onload=function(){ sendTextureToTEXTURE1(image1);};
  image2.onload=function(){ sendTextureToTEXTURE2(image2);};
  image0.src='./images/Stone_13-512x512.png'; //Wall1 Texture
  image1.src='./images/Tile_04-512x512.png'; // Floor Texture
  image2.src='./images/Stone_08-512x512.png'; // Stone Texture

  return true;
}


function sendTextureToTEXTURE0(image){
  //creates the actual texture that connects to our gl object
  var texture0=gl.createTexture();
  if(!texture0){
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip image y axis
  gl.activeTexture(gl.TEXTURE0); //enable texture
  gl.bindTexture(gl.TEXTURE_2D, texture0); //bind texture object to target
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //set texture parameters
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image); //set texture image
  gl.uniform1i(u_Sampler0, 0); //u_Sampler0 is used
  console.log("finished loadTexture 0");
}
function sendTextureToTEXTURE1(image){
  //creates the actual texture that connects to our gl object
  var texture1=gl.createTexture();
  if(!texture1){
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip image y axis
  gl.activeTexture(gl.TEXTURE1); //enable texture1
  gl.bindTexture(gl.TEXTURE_2D,texture1); //bind texture object to target
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //set texture parameters
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image); //set texture image
  gl.uniform1i(u_Sampler1, 1); //u_Sampler1 is used
  console.log("finished loadTexture 1");
}

function sendTextureToTEXTURE2(image){
  //creates the actual texture that connects to our gl object
  var texture2=gl.createTexture();
  if(!texture2){
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip image y axis
  gl.activeTexture(gl.TEXTURE2); //enable texture1
  gl.bindTexture(gl.TEXTURE_2D,texture2); //bind texture object to target
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //set texture parameters
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image); //set texture image
  gl.uniform1i(u_Sampler2, 2); //u_Sampler1 is used
  console.log("finished loadTexture 2");
}

//doing let camea
let camera;

function main() {
  setupWebGL();
  connectVariableToGLSL();
  addActionsForHTMLUI();
  camera = new Camera();
  initTextures();// initialize textures

  
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
  document.addEventListener('keydown', keydown); //added event listener for when keydown

  
  // Specify the color for clearing <canvas>

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);

  //renderScene();

  requestAnimationFrame(tick);

}

