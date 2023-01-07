let doTexture = true;
/*
Veggie format
{
    size: 
    coords: [x, y]
}
*/
let veggies = [];
const veggieSpacing = 150
const veggieRows = 3;
const veggieCols = 4;
let prevTime;
const growRate = 0.08;
let world;
const _frameRate = 60;
const looseOnes = [];
let ground;

function buildVeggies() {
    const heightStart = -veggieRows * veggieSpacing / 2;
    const widthStart = -veggieCols * veggieSpacing / 2;

    for(let x= 0; x < veggieCols; x++) {
        for(let y= 0; y < veggieRows; y++) {
            const xCoord = widthStart + x * veggieSpacing;
            const yCoord = heightStart + y * veggieSpacing;
            const size = 2
            veggies.push({
                size,
                popped: false,
                coords: [xCoord, yCoord, 0],
                type:'box'
            });
        }
    }
}

function preload() {
    img = loadImage('fur.jpg');
    frameRate(_frameRate);
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
    buildVeggies();  
}

function setup() { 
  createCanvas(800, 600, WEBGL);
  createEasyCam();
  prevTime = new Date().valueOf();
  world.play();
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

function draw(){
    const timeChange = getTimeChange();
    background(64);
    //ambientLight(255) 
    //lights();
    texture(doTexture ? img : 0);
    push()
    console.log(ground)
    translate(ground.position.x, ground.position.y, ground.position.z);
    plane(1800, 1800);
    pop()
    looseOnes.forEach((loose) => {
        push();
        rotateX(loose.currentRotation.x);
        rotateY(loose.currentRotation.y);
        rotateZ(loose.currentRotation.z);
        translate(loose.position.x, loose.position.y, loose.position.z);
        box(100);
        pop();
    })
    veggies.forEach((veg) => {
        if(veg.popped) {
            return;
        }
        //Push a new transformation on the stack
        push();
        //Move the thing
        translate(veg.coords[0], 
            veg.coords[1], veg.size / 2)
        box(veg.size);
        if(veg.size < 100) {
            veg.size += growRate * timeChange;
        } else {
            veg.popped = true;
            looseOnes.push(world.add({ 
                type:'box', // type of shape : sphere, box, cylinder 
                size:[100,100,100], // size of shape
                pos:[...veg.coords, 200], // start position in degree
                rot:[0,0,0], // start rotation in degree
                move: true, // dynamic or statique
                density: 1,
                friction: 0.2,
                restitution: 0.2,
                belongsTo: 1, // The bits of the collision groups to which the shape belongs.
                collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
            }));
        }
        //Clean up our transformation
        pop();
    });
    world.play();
}

function keyPressed(){
    doTexture = !doTexture;
}