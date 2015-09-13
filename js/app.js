/** Declare variables **/
"use strict";
//Map boundaries
var boundyTop = -50;
var boundyBottom = 450;
var boundxRight = 410;
var boundxLeft = 0;
//Player starting position
var playerX = 205;  //canvas width is 505
var playerY = 400;  //canvas height is 606
//Movement distances
var horizontal = 100;
var vertical = 85;
var enemyWidth = 60;
var enemyHeight = 30;
//Item dimensions
var itemX = 3;
var itemY = 67;
var itemWidth = 10;
var itemHeight = 10;
//Game obstacles
var obstructX = 305;
var obstructY = 60;
var obstructWidth = 100;
var obstructHeight = 60;

/**************** Game Status Code ****************/
var Game = function () {
    this.endGame = false;
    this.winGame = false;
    this.restart = false;
};

//Check status of game
Game.prototype.update = function () {
    this.win();
};

//Check if player has won
Game.prototype.win = function () {
    if (player.x === 305 && player.y === -25) {
        this.winGame = true;
    }
};

//Declare a new game
var newGame = new Game();

/**************** Item Code ****************/
var Item = function () {
    this.item = true;
    this.x = itemX;
    this.y = itemY;
    this.sprite = 'images/Star.png';
    this.loc = "present";
};

//Draw the item on the screen
Item.prototype.render = function () {
    if (this.loc === 'present') {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

//Check status of item
Item.prototype.update = function () {
    this.statusCheck();
};

//If player touches item, remove item
Item.prototype.statusCheck = function () {
    if (item.collide() === true) {
        this.loc = 'remove';
    }
};

//Check for collisions with items
Item.prototype.collide = function () {
    if (this.x <player.x + itemWidth && this.x > player.x - itemWidth && this.y < player.y + itemHeight && this.y >player.y - itemHeight) {
        return true;
    }
};

//declare new item
var item = new Item();

/**************** Obstruction Code ****************/
var Obstruction = function () {
    this.x = obstructX;
    this.y = obstructY;
    this.sprite = 'images/Rock.png';
    this.loc = 'present';
};

//Draw the item on the screen
Obstruction.prototype.render = function () {
    if (this.loc === 'present') {
       ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

//Check status of obstruction
Obstruction.prototype.update = function () {
    this.statusCheck();
};

//If player touches obstruction, remove obstruction
Obstruction.prototype.statusCheck = function () {
    if (item.collide() === true) {
        this.loc = 'remove';
    }
};

//Check if barrier is present
Obstruction.prototype.barrier = function () {
    if (this.loc === 'present') {
        return true;
    } else {
        return false;
    }
};

//Declare new obstruction
var obstruction = new Obstruction();

/**************** Enemy Code ****************/
// Enemies our player must avoid
var Enemy = function (locx, locy, speed) {
    this.x = locx;
    this.y = locy;
    this.speed = speed;
    //Load the enemy moving to the right
    this.direction = "right";
    //Load the enemy facing right
    this.sprite = 'images/enemy-bug-right.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    this.location();
    this.move(dt);
    this.pic();
};

//Assign a direction to the enemies depending on their x location
//also assign an image to the enemy depending on their movement direction
Enemy.prototype.location = function (dt) {
    if (this.y<70 && obstruction.barrier() === true){
        if(this.x > 200) {
            this.direction = "left";
        } else if (this.x < boundxLeft){
            this.direction = "right";
        }
    }
    if (this.x > boundxRight) {
        this.direction = "left";
    } else if (this.x < boundxLeft){
        this.direction = "right";
    }
};

//Assign a speed to the enemies depending on their direction
Enemy.prototype.move = function (dt) {
    if (this.direction === "left") {
        this.x -= (this.speed*dt);
    } else if (this.direction === "right") {
        this.x += (this.speed*dt);
    }
};

//Assign an image to the enemy depending on their direction
Enemy.prototype.pic = function () {
    "use strict";
    if (this.direction === "left") {
        this.sprite = 'images/enemy-bug-left.png';
    } else if (this.direction === "right") {
        this.sprite = 'images/enemy-bug-right.png';
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Place all enemy objects in an array called allEnemies
var allEnemies = [];

//Initiate enemies with random speeds
for (var i = 0; i < 3; i++) {
    var enemySpeed=getRandomInt(100,300);
    //Randomize speed of enemies
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    allEnemies.push(new Enemy(-50,60+82*i, enemySpeed));
}

/**************** Player Code ****************/
//Create player class
var Player = function () {
    this.x = playerX;
    this.y = playerY;
    this.sprite = "images/char-horn-girl.png";
};

//Update player's position
Player.prototype.update = function (dt) {
    //this.x += this.speed*dt;
    //use same dt parameter as enemy
    //ensure that game runs at same speed across various computers
};

//Draw the player on the screen if game is not over
Player.prototype.render = function () {
    if (newGame.endGame === false) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

//Check to see where the user wants to move to and only apply
//Only allow player to move if the game hasn't ended
if (newGame.endGame === false && newGame.winGame === false) {
    // if movement is within the bounds of the map
    Player.prototype.handleInput = function (keycode) {
        switch (keycode) {
        case "left":
            //*Barrier Present
            //Stop from waking into barrier if barrier is present
            if (obstruction.barrier() === true && this.x === (obstructX + obstructWidth) && this.y === obstructY) {
            //Stay in bounds of screen
            } else if (obstruction.barrier() === true && this.x - horizontal > boundxLeft && (this.y !== obstructY || this.x !== (obstructX + obstructWidth))) {
                this.x -= horizontal;
            //*Barrier not present
            //Stay in map bounds
            } else if (obstruction.barrier() === false && this.x - horizontal < boundxLeft) {
            //Do not walk into water
            } else if (obstruction.barrier() === false && this.x === obstructX && this.y < obstructY) {
            } else if (obstruction.barrier() === false && this.x - horizontal > boundxLeft) {
                this.x -= horizontal;
            }
            break;
        case "right":
            //*Barrier Present//
            //Stay in map bounds
            if (obstruction.barrier() === true && this.x + horizontal > boundxRight) {
            //Do not walk into barrier
            } else if (obstruction.barrier() === true && this.x === (obstructX - obstructWidth) && this.y === obstructY) {
            //Allow movement if barrier not in the way
            } else if (obstruction.barrier() === true && (this.x !== (obstructX - obstructWidth) || this.y !== obstructY)) {
                this.x += horizontal;
            //*Barrier Removed//
            //Stay in map bounds
            } else if (obstruction.barrier() === false && this.x + horizontal > boundxRight) {
            //Do not walk in water
            } else if (obstruction.barrier() === false && this.x + horizontal > (obstructX - obstructWidth) && this.y < obstructY) {
            } else if (obstruction.barrier() === false && this.x + horizontal < boundxRight) {
                this.x += horizontal;
            }
            break;
        case "up":
            //*Barrier Present//
            //Stop from walking into barrier if barrier is present
            if (this.x === (obstructX) && obstruction.barrier() === true && this.y - vertical < (obstructY + obstructHeight)) {
            } else if (this.x === (obstructX) && obstruction.barrier() === true && this.y.vertical > (obstructY + obstructHeight) && this.y - vertical < boundyTop) {
            //prevent player from walking into water
            } else if (this.x !== (obstructX) && obstruction.barrier() === true && this.y - vertical < obstructY) {
            //***Barrier Removed//
            //Allow player to walk upwards if barrier is removed
            } else if (this.x === (obstructX) && obstruction.barrier() === false && this.y - vertical < boundyTop) {
            } else if (this.x !== (obstructX) && obstruction.barrier() === false && this.y - vertical < obstructY) {
            } else {
                this.y -= vertical;
            }
            break;
        case "down":
            if (this.y + vertical > boundyBottom) {
            } else {
                this.y += vertical;
            }
            break;
        case "space":
            //Reset player status
            if (newGame.endGame === true) {
                player.reset();
                obstruction.loc = "present";
                item.loc = "present";
            } else if (newGame.winGame === true) {
                player.reset();
                obstruction.loc = "present";
                item.loc = "present";
            }
            break;
        }
    };
}

//Reset player position and game status
Player.prototype.reset = function () {
    this.x = playerX;
    this.y = playerY;
    newGame.endGame = false;
    newGame.winGame = false;
};

//*******  Check for collisions
Player.prototype.collide = function () {
    for(var i = 0; i < allEnemies.length; i++) {
        if (this.x < allEnemies[i].x + enemyWidth && this.x > allEnemies[i].x - enemyWidth && this.y < allEnemies[i].y + enemyHeight && this.y > allEnemies[i].y - enemyHeight) {
            return true;
        }
    }
};

// Instantiate a new player object
// Place the player object in a variable called player
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener ('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
