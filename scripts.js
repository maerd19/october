// 1. Quitar bricks de arreglo cuando bala haga colision X
// 2. Hacer que los bricks disparen
// 3. Detener disparos de bricks si colisionan con personaje
// 4. Disminuir vida de personaje cuando los disparos le colisionen
// 5. Disminuir vida de tren cuando los disparos colisionen con el fondo del canvas

// Interval to end game
let interval;

// level definition variables
let level = prompt('level');
let speed = (level == 1) ? 100 : (level == 2) ? 10 : 1;

// canvas definition
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Mouse position
let mouseX = 0;
let mouseY = 0;

// bricks
let brickArray = [];
let frames = 0;

// Bullet
let bulletArr = [];

const shoot = e => { 
    if (e.button == 0) {
        let myBullets = bulletArr.filter(bullet => bullet.isURSS == true);
        if(myBullets.length <= 2) bulletArr.push(new Bullets(mouseX, mouseY, 50, 50, true)); // allows to shoot only 3 bullets
    }
}

canvas.addEventListener('mousemove', setMousePos);
addEventListener('mousedown', shoot);


// Update mouse coordinates
let canvasPos = getPosition(canvas)

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

    collision(item) {
        return (
          this.x < item.x + item.width &&
          this.x + this.width > item.x &&
          this.y < item.y + item.height &&
          this.y + this.height > item.y
        );
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
    constructor(width,height, x, y) {
        let image = new Image();
        image.src = 'https://www.spriters-resource.com/resources/sheet_icons/11/11242.png';
        super(x, y, width,height, image);
        this.lifePoints = 1000;
        this.shield = 100;
    }

    draw(x, y) {
        ctx.drawImage(this.image, x, y, this.width,this.height);        
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

    shoot() {
        bulletArr.push(new Bullets(this.x, this.y, 50, 50, false)); // allows to shoot only 3 bullets
    }
}

class Bullets extends Item {
    constructor(x, y, width, height, isURSS) {
        let image = new Image();
        image.src = 'https://www.sccpre.cat/mypng/full/49-495275_bullets-clipart-sprite-bullets-sprite.png',
        super(x,y, width,height, image);
        this.isURSS = isURSS;
    }

    draw() {
        (this.isURSS) ? this.y -= 1 : this.y += 1
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
    }
}

const background = new Background(0, 0, canvas.width, canvas.height);
const player = new Player(200, 200, mouseX, mouseY);
// const bullet = new Bullets(player.x, playery, 50, 50);

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
        if(frames % 200 == 0) brick.shoot();
    });
}

const drawBullets = () => {
    bulletArr.forEach((bullet, i) => {
        // Bala salio de canvas por arriba
        if(bullet.y + bullet.height < 0) {
            bulletArr.splice(0, 1);
        }
        bullet.draw();

        if(frames % 60) bullet.isURSS == false;

        brickArray.forEach((brick, idx) => {
            // Colision con brick
            if(bullet.collision(brick) && bullet.isURSS) {
                bulletArr.splice(i, 1);
                brickArray.splice(idx, 1);
            }            
        });

        // Colision con personaje
        if(bullet.collision(player) && !(bullet.isURSS)) {
            bulletArr.splice(i, 1);
            (player.shield <= 0) ? player.lifePoints -= 1 : player.shield -= 1;
            console.log('golpe con piolet :(');
            console.log(`shield: ${player.shield} life: ${player.lifePoints}`);
            if(player.lifePoints == 0) gameOver();
        }

        // Colision con fondo del canvas
        if(bullet.y + bullet.height > canvas.height) {
            bulletArr.splice(i, 1);
            console.log('golpe al tren');            
        }
    });        
}

function gameOver() {    
    ctx.fillText("GameOver morro", 235, 200);
    clearInterval(interval);
  }

const moveCharacter = () => {
    player.draw(mouseX, mouseY);
    requestAnimationFrame(moveCharacter);
}

const draw = () => {
    background.draw();
    generateBricks();
    drawEnemies();
    drawBullets();
    drawTrain();
}

interval = setInterval( () => {
    frames++;
    draw();
}, speed/6);
moveCharacter();

