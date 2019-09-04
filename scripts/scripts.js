// 2. Animaciones
// 4. Transiciones
// 5. Funcion de terminar juego

// canvas definition
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// canvas definition
const canvasScores = document.getElementById('scores');
const ctxScores = canvasScores.getContext('2d');

// Interval to end game
let interval;

let levelVariables = {
    enemyBullets: 5,
    playerBullets: 3,
    bricksDestroyed: 10,
    speed: 100,
    level: 1
}

// Mouse position
let mouseX = 0;
let mouseY = 0;

// bricks
let brickArray = [];
let frames = 0;
let bricksDestroyed = 0;

// Bullet
let bulletArr = [];

const shoot = orientation => { 
    let myBullets = bulletArr.filter(bullet => bullet.isURSS == true);
    console.log(orientation);    
    if(myBullets.length <= levelVariables.playerBullets) bulletArr.push(new Bullets(mouseX, mouseY, 50, 50, true, orientation));     
}

canvas.addEventListener('mousemove', setMousePos);



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
    
    collision(player) {
        return (
          this.x < mouseX + player.width &&
          this.x + this.width > mouseX &&
          this.y < mouseY + player.height &&
          this.y + this.height > mouseY
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
        // image.src = 'https://www.spriters-resource.com/resources/sheet_icons/11/11242.png';
        image.src =  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjsBCgoKDQ0OFQ0MDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIADAAMAMBIgACEQEDEQH/xAAZAAADAQEBAAAAAAAAAAAAAAAEBQYHAwL/xAAwEAABAwMCAwYEBwAAAAAAAAABAgMEAAUREiEGMVEHE0FhgZEVI3GhFDJCQ1Ox8f/EABUBAQEAAAAAAAAAAAAAAAAAAAEA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AzW5/JUlOSfOlzr2D1Joua6X0hSxuKVqUA4CRnflQBP459LAZDiu7BJSkbV5TMkNnWHFZ8zmqThzhiLdYneyHHUuqURgKxj6UdP7N5qcm3Pocb050vHSr3AqSc+OCSylmSgIUNgtI2PpTfg0BV43/AIzypBeLBc7O2ly4RVNoKtIVkEZ9Ke9m5C7skHfCFCpFUhhQQc8ga8w7aZMpgaSQtW9Or5F7sa2+RVvQ9l71c9pDKfmIOduZ8cVJUWZbFrlFmZqZ7sAYwDg46A5+1XoWw/BRIivtuIKfzoXke9cJos0e2uXWWC24wg4woBRPLA887eVCWLhpE3hVltbykJmLMrSnGk6uQ9AKSlO0Ql+xPJ1JcUXEBISrO+r/AGkXZrEWm/NNnOSFAn0qu48tbcC3tNIGcOBRIHLYgAdPGlnZs0fjzZOxGrn9DQE3cZMmdjWEtgblKeddOGWXnbsY0UgS1NlUcH9a0jOn1Tq9cUTMhlA2GF/3QjBeg3GNOj7PMOIdRv4g5++Kkr7dw7a+JWlyVyZRubKiHYLroSo9UpyNjzpxcLI7wmI11YvCoUNrQFwn1FYKPFKcE5J35dfCn3EnCdl4stzN9gTU25a29a5Q2SpPiF7jcYxmsv49cgttWWHbpRlttxnHFPlZUVKU4U7k4P7fQeW1JdL3xo3emFtPRFMLLupCwvUNPQ9DTvszZbcu4OcnfHsazI5zmrLs1v8ADtN2Qi5u9yypQCXSNhz59B50B//Z'
        super(x,y, width,height, image);
        this.lifePoints = 50;
        this.shield = 50;
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
        // if(bulletArr.filter())
        let enemyBullets = bulletArr.filter(bullet => bullet.isURSS == false);
        // if (enemyBullets.length <= 20) {
        if (enemyBullets.length <= levelVariables.enemyBullets) {
        

            bulletArr.push(new Bullets(this.x, this.y, 50, 50, false)); // allows to shoot only 
            console.log(enemyBullets.length);
        }
    }

   
}

class Bullets extends Item {
    constructor(x, y, width, height, isURSS, direction) {
        let image = new Image();
        image.src = 'https://www.sccpre.cat/mypng/full/49-495275_bullets-clipart-sprite-bullets-sprite.png',
        super(x,y, width,height, image);
        this.isURSS = isURSS;
        this.direction = direction;
    }

    draw() {
        if (!this.isURSS) (this.y += 1)
        if (this.direction ==='d') (this.x += 1);
        if (this.direction ==='a') (this.x -= 1);
        if (this.direction ==='w') (this.y -= 1);
        if (this.direction ==='s') (this.y += 1);
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
    }



    collision2(item) {
        return (
          this.x < item.x + item.width &&
          this.x + this.width > item.x &&
          this.y < item.y + item.height &&
          this.y + this.height > item.y
        );
    }
    
}

class Train extends Item {
    constructor(width,height, x,y) {
        let image = new Image();
        image.src =  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjsBCgoKDQ0OFQ0MDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIADAAMAMBIgACEQEDEQH/xAAZAAADAQEBAAAAAAAAAAAAAAAEBQYHAwL/xAAwEAABAwMCAwYEBwAAAAAAAAABAgMEAAUREiEGMVEHE0FhgZEVI3GhFDJCQ1Ox8f/EABUBAQEAAAAAAAAAAAAAAAAAAAEA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AzW5/JUlOSfOlzr2D1Joua6X0hSxuKVqUA4CRnflQBP459LAZDiu7BJSkbV5TMkNnWHFZ8zmqThzhiLdYneyHHUuqURgKxj6UdP7N5qcm3Pocb050vHSr3AqSc+OCSylmSgIUNgtI2PpTfg0BV43/AIzypBeLBc7O2ly4RVNoKtIVkEZ9Ke9m5C7skHfCFCpFUhhQQc8ga8w7aZMpgaSQtW9Or5F7sa2+RVvQ9l71c9pDKfmIOduZ8cVJUWZbFrlFmZqZ7sAYwDg46A5+1XoWw/BRIivtuIKfzoXke9cJos0e2uXWWC24wg4woBRPLA887eVCWLhpE3hVltbykJmLMrSnGk6uQ9AKSlO0Ql+xPJ1JcUXEBISrO+r/AGkXZrEWm/NNnOSFAn0qu48tbcC3tNIGcOBRIHLYgAdPGlnZs0fjzZOxGrn9DQE3cZMmdjWEtgblKeddOGWXnbsY0UgS1NlUcH9a0jOn1Tq9cUTMhlA2GF/3QjBeg3GNOj7PMOIdRv4g5++Kkr7dw7a+JWlyVyZRubKiHYLroSo9UpyNjzpxcLI7wmI11YvCoUNrQFwn1FYKPFKcE5J35dfCn3EnCdl4stzN9gTU25a29a5Q2SpPiF7jcYxmsv49cgttWWHbpRlttxnHFPlZUVKU4U7k4P7fQeW1JdL3xo3emFtPRFMLLupCwvUNPQ9DTvszZbcu4OcnfHsazI5zmrLs1v8ADtN2Qi5u9yypQCXSNhz59B50B//Z'
        super(x,y, width,height, image);
        this.lifePoints = 50;
        this.vx = 5;
        this.direction = true
    }

    draw() {
        (this.direction) ? this.x += 2 : this.x -= 2

        ctx.drawImage(this.image,this.x, this.y, this.width, this.height);
    }
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  }

  class statusBar{

    constructor(x,y,width,height,radius,color){ 
    this.width= width;
    this.height = height;
    this.x = x;
    this.y =y;
    this.radius = radius
    this.color =color
    
    this.update = function(){
      
        ctxScores.fillRect(this.x, this.y,this.width,this.height,this.radius )
    }
  }
  
  draw(health){
      ctxScores.fillStyle = this.color;
      if(health <= 0)health=0
      ctxScores.fillRect(this.x, this.y, health ,this.height,this.radius)
      }
    
  };

  

// Instances

// Background
const background = new Background(0, 0, canvas.width, canvas.height);
// LifeBars
const shieldBar = new statusBar (500,20,250,30,10,'blue');
const lifeBar = new statusBar (500,40,250,30,10,'green');
const trainBar = new statusBar (500,60,250,30,10,'orange');
// Player
const player = new Player(200, 200, mouseX, mouseY);
const train = new Train(500, 100, 30, 400);
// Sounds
const yourShot = new sound("./assets/grenade-launcher.mp3");
const foeShot = new sound("./assets/Shotgun.mp3");
const main = new sound("./assets/international_communist.mp3");
const mainFaster = new sound("./assets/international_communist_double.mp3");
const sad_song = new sound("./assets/sad_song.mp3");


const generateBricks = () => {
    if(frames % 50 == 0) {
        const brick = new Brick(0,0, 80,30, 'blue', true)
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
        if (brick.x + brick.width < 0 && !brick.direction) {
            brick.y += 40;
            brick.direction = true;
        }
        // enemigos colisionan con el tren        
        if (brick.collision(train)) gameOver();
        // enemigos colisionan con personaje con escudo
        if (brick.collision(player) && player.shield > 0) player.shield -= 1;
        // enemigos colisionan con personaje sin escudo
        if (brick.collision(player) && player.shield == 0) gameOver();        
        
        brick.draw();
        if(frames % 200 == 0) brick.shoot();
    });
}

const drawBullets = () => {
    bulletArr.forEach((bullet, i) => {        
        bullet.draw();
        // generar sonido
        (bullet.isURSS) ? yourShot.play() : foeShot.play();        
        if (frames % 100) bullet.isURSS == false;

        brickArray.forEach((brick, idx) => {
            // Colision con enemigo
            if(bullet.collision2(brick) && bullet.isURSS) {
                bulletArr.splice(i, 1);
                brickArray.splice(idx, 1);
                // (bricksDestroyed == 20) ? gameOver() : bricksDestroyed++;
                (bricksDestroyed === levelVariables.bricksDestroyed) ? thankYouNext() : bricksDestroyed++;
            }            
        });

        // Colision con personaje
        if (bullet.collision(player) && !(bullet.isURSS)) {       
            (player.shield <= 0) ? player.lifePoints -= 1 : player.shield -= 1;
            console.log(`shield: ${player.shield} player lifepoints: ${player.lifePoints}`);
            bulletArr.splice(i, 1);
            if(player.lifePoints == 0) gameOver();
        }

        // Colision con tren
        if (bullet.collision2(train) && !(bullet.isURSS)) {
            train.lifePoints -= 1;
            console.log(`train lifepoints: ${train.lifePoints}`);
            bulletArr.splice(i, 1);
            if(train.lifePoints == 0) gameOver();
        }

        // Bala salio de canvas por arriba
        if (bullet.y + bullet.height < 0) {
            bulletArr.splice(i, 1);
        }

        // Bala salio de canvas por abajo
        if (bullet.y + bullet.height > canvas.height) {
            bulletArr.splice(i, 1);
        }

        // Bala salio de canvas por la derecha
        if (bullet.x + bullet.width > canvas.width) {
            bulletArr.splice(i, 1);
        }

        // Bala salio de canvas por izquierda
        if (bullet.x + bullet.width < 0) {
            bulletArr.splice(i, 1);
        }
    });        
}

const drawTrain = () => {
    if ((train.x + train.width )- canvas.width >= canvas.width - (train.x+ train.width) && train.direction) train.direction = false
    if ((train.x) === 0 && !train.direction) train.direction = true
    train.draw()
}

function thankYouNext() {
    clearInterval(interval);
    if (levelVariables.level < 4) {            
            bricksDestroyed = 0;
            interval = undefined;
            brickArray = [];
        ctx.fillText("Presiona n para el siguiente nivel", 235, 200);        
        increaseLevel();
        main.stop();
    }
}

const increaseLevel = () => {
    levelVariables.level += 1;
    levelVariables.playerBullets = 6;
    levelVariables.enemyBullets = 10;
    levelVariables.speed = 10;
    levelVariables.bricksDestroyed = 15;
    console.log(`You've arrived to level ${levelVariables.level}`);
}

function gameOver() {    
    ctx.fillText("GameOver morro", 235, 200);
    (levelVariables.level == 1) ? main.stop() : mainFaster.stop();
    sad_song.play();
    clearInterval(interval);
  }

const moveCharacter = () => {
    player.draw(mouseX, mouseY);
    requestAnimationFrame(moveCharacter);
}

const drawBars = () => {
    shieldBar.draw(player.shield)
    lifeBar.draw(player.lifePoints)
    trainBar.draw(train.lifePoints)
}

const backgroundMusic = () => {
    (levelVariables.level == 1) ? main.play() : mainFaster.play();
}

const draw = () => {
    background.draw();
    backgroundMusic();
    generateBricks();
    drawEnemies();
    drawBullets();
    drawTrain();
    drawBars();
}

const start =() => {
    interval = setInterval( () => {
        frames++;
        draw();
    }, levelVariables.speed/6);
    moveCharacter();
}

addEventListener('keydown', (e)=>{
    if(e.keyCode === 78 && !interval) start();

    if(e.keyCode === 87 && interval) shoot('w');
    if(e.keyCode === 68 && interval) shoot('d');
    if(e.keyCode === 65 && interval) shoot('a');
    if(e.keyCode === 83 && interval) shoot('s');
})