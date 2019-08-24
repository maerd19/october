const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

class Item {
    constructor(x,y, width, height, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
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

class Brick extends Item{
    constructor(x=0,y, width, height, image) {
                
        super(x,y, width,height, image);
    }

    draw() {
        ctx.fillStyle = this.image;
        if(frames % 10) this.x += 2;
        ctx.fillRect(this.x,this.y, this.width,this.height);
    }
}


// const secondRow = new Bricks(80, 30, 4, 8, 'orange');
const background = new Background(0, 0, canvas.width, canvas.height);
let brickArray = [];
let frames = 0;

const draw = () => {
    background.draw();
    // firstRow.draw();
    generateBricks();
    drawEnemies();
}

setInterval( () => {
    frames++;
    draw();
}, 1000/60);

const generateBricks = () => { 
    if(frames % 100 == 0 || frames % 60 == 0 || frames % 170 == 0) {
        const brick = new Brick(0,80,30,'red');
        brickArray.push(brick);
        // console.log(brick);        
    }
}

const drawEnemies = () => {
    brickArray.forEach( x => {
        x.draw();
          
    });
}