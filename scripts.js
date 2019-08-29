// level definition variables
let level = prompt('level');
let speed = (level == 1) ? 100 : (level == 2) ? 10 : 1;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Mouse position
let mouseX = 0;
let mouseY = 0;

// bricks
let brickArray = [];
let frames = 0;

let canvasPos = getPosition(canvas)

canvas.addEventListener('mousemove', setMousePos);

// Update mouse coordinates
function setMousePos (e) {
    mouseX = e.clientX - canvasPos.x;
    mouseY = e.clientY - canvasPos.y;    
}

// Set mouse coordinates
function getPosition(a) {
    let xPosition = 0;
    let yPosition = 0;

    while(a) {
        xPosition += (a.offsetLeft - a.scrollLeft + a.clientLeft);
        yPosition += (a.offsetTop - a.scrollTop + a.clientTop);
        a = a.offsetParent;
    }

    return {
        x: xPosition,
        y: yPosition
    };
}



class Item {
    constructor(x,y, width, height, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
    }

    draw() {
        ctx.drawImage(this.x, this.y, this.width, this.height, this.image);
    }
}

class Background extends Item {
    constructor(x,y, width,height, img = 'http://i.imgur.com/NfzRkvK.png') {
        let image = new Image();
        image.src = img;
        super(x,y, width,height, image);
    }

    draw() {
        this.x-=2;
        if(this.x < -canvas.width) this.x = 0;
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
        ctx.drawImage(this.image,this.x + this.width,this.y,this.width,this.height);
    }
}

class Player extends Item {
    constructor(width,height, img) {
        let image = new Image();
        image.src = 'https://www.spriters-resource.com/resources/sheet_icons/11/11242.png';
        super(width,height, image);
    }

    draw(x, y) {
        // ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
        // ctx.drawImage(this.image, x, y, this.width,this.height);
        console.log(x,y);
        
    }
}

class Brick extends Item {
     constructor(x, y, width, height, image, direction) {
        super(x,y, width,height, image);
        this.direction = direction;
     }

    draw() {
        if(frames % 10) {
            if(this.direction) this.x += 2;
            if(!this.direction) this.x -= 2;
        }
        ctx.fillStyle = this.image; //color
        ctx.fillRect(this.x,this.y, this.width,this.height);
    }
}

const background = new Background(0, 0, canvas.width, canvas.height);
const player = new Player(200, 200, )

const generateBricks = () => {
    if(frames % 50 == 0) {
        const brick = new Brick(0,0, 80,30, 'red', true)
        if(brickArray.length < 9) brickArray.push(brick);
    }
}

const drawEnemies = () => {
    brickArray.forEach( brick => {
        // se llego al extremo derecho del canvas
        if (brick.x + brick.width >= canvas.width + brick.width && brick.direction) {
            brick.y += 40;
            brick.direction = false;
        }
        // se llego al extremo izquierdo del canvas
        if(brick.x + brick.width < 0 && !brick.direction) {
            brick.y += 40;
            brick.direction = true;
        }
        // se llego al fondo del canvas        
        if (brick.y > canvas.height) {
            brick.y = 0;
        }
        
        brick.draw();
    });
}

const moveCharacter = () => {
    player.draw(mouseX, mouseY);
    requestAnimationFrame(moveCharacter);
}

const draw = () => {
    background.draw();
    generateBricks();
    drawEnemies();
}

setInterval( () => {
    frames++;
    draw();
}, speed/6);
moveCharacter();