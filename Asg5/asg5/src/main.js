import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

//I followed the guide
//I also watched the following tutorial to get started on three js but kind of built my own thing
//https://www.youtube.com/watch?v=Q7AOvWpIVHU

//Setup ThreeJS
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'), //from fireship video
});

//Setting up the camera positions
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.set(25, 10, 25);
camera.rotation.y = Math.PI * .25;


const controls = new OrbitControls(camera, renderer.domElement);

//this was originally a pointlight I learned from fireship vid
//Spotlight in the capybara hut
const spotLight = new THREE.SpotLight(0xffff00,100,10);
spotLight.position.set(15,10,10)
spotLight.scale.set(5,5,5);
const spotLightHelper = new THREE.PointLightHelper(spotLight); // learned how to do the helper from fireship vid


//pointlight on ball
const sTex = new THREE.TextureLoader().load('/src/images/Elements_02-512x512.png')
const ball = new THREE.Mesh(
  new THREE.SphereGeometry(3,64,64),
  new THREE.MeshStandardMaterial({ map: sTex}) //learned about meshstandard from fireship vid
  );
scene.scale.set(.5,.5,.5);
ball.position.set(-10,3.5,-15);
scene.add(ball);
const pointLight = new THREE.PointLight(0xffffff,100);
pointLight.position.set(-10,3.5,-15);
const pointLightHelper = new THREE.PointLightHelper(pointLight);


const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
ambientLight.position.set(10,50,10)
ambientLight.scale.set(10,10,10)
const ambientLightHelper = new THREE.PointLightHelper(ambientLight);


const directionLight = new THREE.DirectionalLight(0xffffff, 2);
directionLight.position.set(-45, 20, 35);
directionLight.scale.set(10,10,10)
const directionLightHelper = new THREE.PointLightHelper(directionLight);


//learned structure for this from fireship tutorial
const geometry = new THREE.CylinderGeometry( 10, 3, 16, 100 ); //similar parameters to fireship tutorial
const material = new THREE.MeshStandardMaterial( { color: 0x00ff00, wireframe: true} ) //learned cylinder from tutorial
const cylinder = new THREE.Mesh( geometry, material );
scene.add( cylinder );


const gridHelper = new THREE.GridHelper(200,50);
scene.add(gridHelper);

//Enable or disable helpers
document.getElementById('helperOn').onclick = function() { scene.add(spotLightHelper, ambientLightHelper,pointLightHelper, directionLightHelper); };
document.getElementById('helperOff').onclick = function() { scene.remove(spotLightHelper, ambientLightHelper,pointLightHelper, directionLightHelper); };

let lightPos=4;
//Light switch
///document.getElementById('lightOn').onclick = function() { scene.add(spotLight, ambientLight,pointLight); };
//document.getElementById('lightOff').onclick = function() { scene.remove(spotLight, ambientLight,pointLight); };
document.getElementById('lightSlide').addEventListener('mousemove', function(){ lightPos = this.value; renderScene();}); 


let animate = false;
let flaminate = false;
//Animation switch
document.getElementById('animateOn').onclick = function() { animate=true; };
document.getElementById('animateOff').onclick = function() { animate=false; };

document.getElementById('flaminateOn').onclick = function() { flaminate=true; };
document.getElementById('flaminateOff').onclick = function() { flaminate=false; };

function lightPosition(value){
  if (value==1){
    scene.add(spotLight);
    scene.remove(pointLight);
    scene.remove(ambientLight);
    scene.remove(directionLight);
  }
  else if (value==2){
    scene.add(spotLight);
    scene.add(pointLight);
    scene.remove(ambientLight);
    scene.remove(directionLight);
  }
  else if (value==3){
    scene.add(spotLight);
    scene.add(pointLight);
    scene.remove(ambientLight);
    scene.add(directionLight);
  }
  else if (value==4){
    scene.add(spotLight);
    scene.add(pointLight);
    scene.add(ambientLight);
    scene.add(directionLight);
  }
}


function moveCylinder(value){
  if(value==true){
    cylinder.position.y+=.1;
    cylinder.position.z+=.01;
    cylinder.rotation.y+=Math.PI/8
  }
  else{
    cylinder.position.set(-45, 10, 35);
  }
}

function moveBall(value){
  if(value==true){
    ball.position.y+=.1;
    ball.position.z+=.01;
    ball.position.x+=.01;
    ball.rotation.y+=Math.PI/8
  }
  else{
    ball.position.set(-10,3.5,-15);
  }
}


function render() {
  requestAnimationFrame(render);
  moveCylinder(animate);
  moveBall(flaminate);
  lightPosition(lightPos);
  renderer.render( scene, camera );
}
const wallTex = new THREE.TextureLoader().load('/src/images/Brick_10-512x512.png');
const topWallTex = new THREE.TextureLoader().load('/src/images/Stone_08-512x512.png');
const tileTex = new THREE.TextureLoader().load('/src/images/Tile_04-512x512.png');
const capySign = new THREE.TextureLoader().load('/src/images/capysign.png');
const rockTex = new THREE.TextureLoader().load('/src/images/Tileable1a.png');
const rockTex2 = new THREE.TextureLoader().load('/src/images/Tileable1k.png');
//my makewall is based on my previous assignments
function makeShack(){
  
  var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [2, 0, 0, 0, 0, 0, 0, 1],
  [2, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 0, 1, 1, 1],
  ];
  for(let x=0;x<8;x++){
    for(let y=0;y<8;y++){
      if(g_map[x][y]==1){ 
        const wall = new THREE.Mesh(
        new THREE.BoxGeometry(3,3,3),
        new THREE.MeshStandardMaterial({ map: wallTex}) //learned about meshstandard from fireship vid
        );
        wall.position.set(x*3,1.5,y*3);
        scene.add(wall);

        const tWall = new THREE.Mesh(
        new THREE.BoxGeometry(3,3,3),
        new THREE.MeshStandardMaterial({ map: topWallTex})
        );
        tWall.scale.set( 1, 2, 1 );
        tWall.position.set(x*3,6,y*3);
        scene.add(tWall);
      }
      if(g_map[x][y]==2){ 
        const wall = new THREE.Mesh(
        new THREE.BoxGeometry(3,3,3),
        new THREE.MeshStandardMaterial({ map: wallTex}) //learned about meshstandard from fireship vid
        );
        wall.position.set(x*3,1.5,y*3);
        scene.add(wall);
      }
    }
  }  
  //roof loop
  for(let x=0;x<8;x++){
    for(let y=0;y<8;y++){
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(3,3,3),
        new THREE.MeshStandardMaterial({ map: wallTex}) //learned about meshstandard from fireship vid
        );
        roof.scale.set( 1, .5, 1 );
        roof.position.set(x*3,9.75,y*3);
        scene.add(roof);
      }
    } 

  tileTex.repeat.set(2,2); //found on threejs site
  tileTex.wrapS = THREE.RepeatWrapping; // generated by claudeai, helps with texture wrapping
  tileTex.wrapT = THREE.RepeatWrapping; // generated by claudeai, helps with texture wrapping
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshStandardMaterial({ map: tileTex}) //learned about meshstandard from fireship vid
    );
  floor.scale.set( 7, .1, 7 );
  floor.position.set(11.9,0.1,10.5);
  scene.add(floor);

  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshStandardMaterial({ map: capySign}) //learned about meshstandard from fireship vid
    );
  sign.rotation.x += Math.PI * 1.5  // rotating 90 degree, didnt realize I could rotate it using Math.PI
  sign.rotation.z += Math.PI * .5 // rotating sign up
  sign.scale.set( 2, .1, 1.1 );
  sign.position.set(22.4,5.2,3);
  scene.add(sign);
  
  renderer.render( scene, camera );
}

function makeTerrain(){
  
  var g_map = [
  // Top Row
  // Row 0: Top border of map and top wall of the first row of chambers
  [1, 2, 3, 3, 2, 2, 2, 3,  1, 1, 2, 2, 3, 3, 2, 1,  1, 2, 2, 2, 1, 2, 3, 3,  3, 3, 2, 1, 1, 1, 1, 0],
  // Rows 1-6: Top Left of the Border
  [1, 0, 0, 0, 0, 0, 0, 0,  0, 0, 1, 1, 0, 1, 1, 0,  2, 1, 1, 1, 1, 0, 0, 0,  1, 3, 3, 2, 2, 1, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 1, 2, 0, 0, 0, 0, 0],
  [1, 0, 2, 0, 3, 3, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 1, 0, 0, 1, 0, 0,  1, 2, 3, 0, 0, 0, 0, 0],
  [1, 0, 2, 0, 2, 2, 2, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  1, 1, 3, 1, 0, 0, 0, 0],
  [1, 0, 1, 3, 0, 3, 3, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 1, 1, 1, 0, 0, 0, 0,  0, 1, 1, 2, 0, 0, 0, 0],
  [1, 0, 0, 2, 2, 2, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0],
  // Row 7: Solid Vertical wall in the middle
  [1, 1, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 1,  0, 0, 0, 0, 0, 1, 1, 0], // ADJUSTED

  // --- Second Row of Chambers (Rows 8-15) ---
  // Row 8: Solid horizontal wall.
  [1, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 1, 0, 0, 0, 0, 0],
  [1, 0, 2, 0, 0, 0, 0, 0,  0, 2, 2, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 1, 2, 3, 1, 0, 0, 0],
  [1, 0, 0, 2, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 1, 1, 0, 0, 0,  0, 0, 1, 3, 3, 1, 0, 0],
  [1, 0, 0, 1, 2, 0, 0, 0,  0, 0, 2, 3, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,   0, 0, 1, 2, 2, 1, 1, 0],
  [1, 2, 0, 0, 1, 3, 0, 0,  0, 0, 0, 2, 0, 0, 0, 0,  0, 0, 0, 1, 3, 1, 0, 0,  0, 0, 0, 1, 2, 0, 0, 0],
  [1, 2, 2, 0, 0, 1, 3, 0,  0, 0, 0, 0, 2, 0, 0, 0,  0, 0, 0, 0, 1, 2, 2, 0,  0, 0, 1, 1, 2, 3, 0, 0],
  [1, 3, 3, 0, 0, 0, 1, 3,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 1, 1, 3, 2, 2, 0],
  // Row 15: Solid Vertical wall in the middle0
  [1, 3, 3, 0, 0, 0, 1, 3,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 1, 1, 3, 2, 2, 0], // ADJUSTED

  // --- Third Row of Chambers (Rows 16-23) ---
  // Row 16: Solid horizontal wall.
  [0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 2, 0, 0, 0, 0, 0,  1, 3, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  2, 3, 1, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  1, 2, 3, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  1, 2, 2, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 1, 1, 2, 1, 1, 0, 0],
  // Row 23: Solid Vertical wall in the middle
  [0, 2, 2, 3, 3, 3, 2, 1,  0, 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 1, 1, 0], 

  // --- Fourth Row of Chambers (Rows 24-31) ---
  // Row 24: Solid horizontal wall.
  [0, 0, 2, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 1, 1, 1, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 2, 2, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 1, 1, 1, 1, 1, 1, 0,  0, 0, 0, 0, 0, 0, 0, 0],
  [0, 3, 1, 2, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  1, 2, 3, 3, 3, 1, 0, 0,  1, 1, 1, 0, 0, 0, 0, 0],
  [0, 3, 3, 1, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 1,  2, 3, 3, 3, 2, 1, 0, 0,  2, 2, 2, 1, 0, 0, 0, 0],
  [0, 0, 3, 3, 1, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,,  1, 2, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 2, 2, 1, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0,  0, 1, 1, 3, 2, 1, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0,  0, 0, 0, 1, 2, 0, 0, 0,  0, 0, 0, 1, 1, 1, 1, 0,  2, 0, 0, 0, 0, 0, 0, 0],
  // Row 31: Solid Vertical wall on the edge
  [1, 2, 2, 1, 1, 3, 3, 3,  1, 2, 2, 3, 3, 2, 1, 1,  2, 3, 3, 2, 2, 1, 1, 1,  1, 1, 1, 2, 2, 3, 3, 0],
];
  for(let x=0;x<32;x++){
    for(let y=0;y<32;y++){
      if(g_map[x][y]==1){ 
        const wall = new THREE.Mesh(
        new THREE.BoxGeometry(3,3,3),
        new THREE.MeshStandardMaterial({ map: rockTex}) //learned about meshstandard from fireship vid
        );
        wall.position.set(6*x-100,3,6*y-100);
        wall.scale.set(2,2,2);
        scene.add(wall);
      }
      if(g_map[x][y]==2){ 
        const wall = new THREE.Mesh(
        new THREE.BoxGeometry(3,3,3),
        new THREE.MeshStandardMaterial({ map: rockTex}) //learned about meshstandard from fireship vid
        );
        wall.position.set(6*x-100,3,6*y-100);
        wall.scale.set(2,4,2);
        scene.add(wall);
      }
      if(g_map[x][y]==3){ 
        const wall = new THREE.Mesh(
        new THREE.BoxGeometry(3,3,3),
        new THREE.MeshStandardMaterial({ map: rockTex2}) //learned about meshstandard from fireship vid
        );
        wall.position.set(6*x-100,4,6*y-100);
        wall.scale.set(2,6,2);
        scene.add(wall);
      }
    }
  }  
  //roof loop
  for(let x=0;x<8;x++){
    for(let y=0;y<8;y++){
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(3,3,3),
        new THREE.MeshStandardMaterial({ map: wallTex}) //learned about meshstandard from fireship vid
        );
        roof.scale.set( 1, .5, 1 );
        roof.position.set(x*3,9.75,y*3);
        scene.add(roof);
      }
    } 
  }

//loading in my capybara obj my mtl wasnt working so i just switch to glb lol
/*
{
  const objLoader = new OBJLoader();
  objLoader.load('src/obj/capyTopHat.obj', (capybara1) => {
    scene.add(capybara1);
    capybara1.position.set(8,0.1,7);
    capybara1.rotation.y += Math.PI * .22;
    capybara1.scale.set(5,5,5);
  });
}
*/
const loader = new GLTFLoader();

// I reused the GLTF loader code from the instruction guide https://threejs.org/docs/#examples/en/loaders/GLTFLoader
loader.load(
	// capybara from https://poly.pizza/m/66d-mKAgF17
	'src/obj/Capybara.glb',
	// called when the resource is loaded
	function ( gltf ) {
		scene.add(gltf.scene);
    gltf.scene.position.set(6.36,0.1,6.5);
    gltf.scene.rotation.y += Math.PI * .22;
    gltf.scene.scale.set(1.25,1.25,1.25);
	},
	// called while loading is progressing
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened' );
	}
);

loader.load(
	// capybara from https://poly.pizza/m/66d-mKAgF17
	'src/obj/Capybara.glb',
	// called when the resource is loaded
	function ( gltf ) {
		scene.add(gltf.scene);
    gltf.scene.position.set(7.6,0.1,15.5);
    gltf.scene.rotation.y += Math.PI * .8;
    gltf.scene.scale.set(1,1,1);
	},
	// called while loading is progressing
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened' );
	}
);

loader.load(
	// alpaca from https://poly.pizza/m/bCVFD48i2l
	'src/obj/Alpaca.glb',
	// called when the resource is loaded
	function ( gltf ) {
		scene.add(gltf.scene);
    gltf.scene.position.set(60,0.1,-50);
    gltf.scene.rotation.y -= Math.PI * .22;
    gltf.scene.scale.set(3,3,3);
	},
	// called while loading is progressing
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened' );
	}
);


const fTex = new THREE.TextureLoader().load('/src/images/Stone_04-512x512.png');
fTex.repeat.set(8,8); //found on threejs site
fTex.wrapS = THREE.RepeatWrapping; // generated by claudeai, helps with texture wrapping
fTex.wrapT = THREE.RepeatWrapping; // generated by claudeai, helps with texture wrapping
const floor = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshStandardMaterial({ map: fTex}) //learned about meshstandard for light reflection from fireship vid
  );
floor.scale.set( 72, .1, 72 );
scene.add(floor);



const skytexture = new THREE.TextureLoader().load('src/images/sky.jpg');
scene.background = skytexture;

makeShack();
makeTerrain();
render();

