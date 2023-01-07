let doTexture = true;
const screenWidth = 800;
const screenHeight = 600;
const groundHeight = 580
let prevTime;
let world;
const _frameRate = 60;
const looseOnes = [];
let ground;
let carpet;
let bark;
let trunk;
let fabric;
function preload() {
    carpet = loadImage('carpet.jpeg');
    bark = loadImage('bark.jpg');
    fabric = loadImage('fabric.jpg');
    trunk = loadImage('trunk.jpeg');
    frameRate(_frameRate);
    /*
    world = new OIMO.World({ 
        timestep: 1/_frameRate, 
        iterations: 8, 
        broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
        worldscale: 1, // scale full world 
        random: true,  // randomize sample
        info: false,   // calculate statistic or not
        gravity: [0, 0, -9.8] 
    });
    
    ground = world.add({
        type:'box', // type of shape : sphere, box, cylinder 
        size:[1800, 1800, 10], // size of shape
        pos:[0, 0, 0], // start position in degree
        rot:[0,0,0], // start rotation in degree
        move: false, // dynamic or statique
        density: 1,
        friction: 0.2,
        belongsTo: 1, // The bits of the collision groups to which the shape belongs.
        collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
    })
    */
}

function setup() { 
  createCanvas(800, 600, WEBGL);
  prevTime = new Date().valueOf();
  createEasyCam();

  //world.play();
  // suppress right-click context menu
  //document.oncontextmenu = function() { return false; }
} 

//Good practice to do this, but oimo is framerate locked
function getTimeChange() {
    const currentTime = new Date().valueOf();
    const timeChange = currentTime - prevTime;
    prevTime = currentTime;
    return timeChange;
}

function drawChair() {
    push();
    //draw the chair
    texture(doTexture ? fabric : 0);
    translate(screenWidth / 2, groundHeight - 100);
    box(200, 75, 200)
    push()
    translate(-100, -75);
    rotate(-.2, [0, 0, 1])
    box(20, 300, 200)
    pop()
    push()
    translate(90, 30);
    rotate(-.2, [0, 0, 1])
    box(20, 100, 200)
    pop()
    pop()
}

function drawDesk() {
    push();
    texture(doTexture ? fabric : 0);
    box(90, 250, 300);
    texture(doTexture ? trunk : 0);
    translate(0, -130)
    box(100, 10, 310);
    pop();
}

function draw(){
    const timeChange = getTimeChange();
    background(64);
    //ambientLight(255) 
    //lights();
    push()
    translate(-screenWidth / 2, -screenHeight / 2)
    push()
    texture(doTexture ? carpet : 0);
    translate(screenWidth / 2, groundHeight, -80);
    box(screenWidth* 2, 20, 650);
    pop()
    push()
    rotate(-.3, [0, 1, 0])
    translate(-400, 0, -200)
    drawChair();
    pop();
    push();
    //draw the desk
    rotate(.3, [0, 1, 0])
    translate(screenWidth, screenHeight - 150, -10)
    drawDesk()
    pop();
    push();
    //draw the stump
    pop();
    pop();
    //world.play();
}

function keyPressed(){
    doTexture = !doTexture;
}