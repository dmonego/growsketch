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

function preload() {
    img = loadImage('fur.jpg');
    const heightStart = -veggieRows * veggieSpacing / 2;
    const widthStart = -veggieCols * veggieSpacing / 2;
    frameRate(_frameRate);
    world = new OIMO.World({ 
        timestep: 1/_frameRate, 
        iterations: 8, 
        broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
        worldscale: 1, // scale full world 
        random: true,  // randomize sample
        info: false,   // calculate statistic or not
        gravity: [0,-9.8,0] 
    });    

    for(let x= 0; x < veggieCols; x++) {
        for(let y= 0; y < veggieRows; y++) {
            const xCoord = widthStart + x * veggieSpacing;
            const yCoord = heightStart + y * veggieSpacing;
            const size = 2
            const body = world.add({ 
                type:'box', // type of shape : sphere, box, cylinder 
                size:[size,size,size], // size of shape
                pos:[xCoord, yCoord,0], // start position in degree
                rot:[0,0,90], // start rotation in degree
                move: true, // dynamic or statique
                density: 1,
                friction: 0.2,
                restitution: 0.2,
                belongsTo: 1, // The bits of the collision groups to which the shape belongs.
                collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
            });
            veggies.push({
                size,
                body,
                coords: [xCoord, yCoord]
            });
        }
    }
}

function setup() { 
  createCanvas(800, 600, WEBGL);
  createEasyCam();
  prevTime = new Date().valueOf();
  // suppress right-click context menu
  //document.oncontextmenu = function() { return false; }
} 

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
    plane(1800, 1800);

    veggies.forEach((veg) => {
        push();
        translate(veg.coords[0], 
            veg.coords[1], veg.size / 2)
        box(veg.size);
        if(veg.size < 100) {
            veg.size += growRate * timeChange;
        }
        pop();
    });
}

function keyPressed(){
    doTexture = !doTexture;
}