/** Declare variables **/
"use strict";
//Map boundaries
var BOUNDY_TOP = -50;
var BOUNDY_BOTTOM = 450;
var BOUNDX_RIGHT = 410;
var BOUNDX_LEFT = 0;
//Player starting position
var PLAYER_X = 205;  //canvas width is 505
var PLAYER_Y = 400;  //canvas height is 606
//Movement distances
var HORIZONTAL = 100;
var VERTICAL = 85;
var ENEMY_WIDTH = 60;
var ENEMY_HEIGHT = 30;
//Item dimensions
var ITEM_X = 3;
var ITEM_Y = 67;
var ITEM_WIDTH = 10;
var ITEM_HEIGHT = 10;
//Game obstacles
var OBSTRUCT_X = 305;
var OBSTRUCT_Y = 60;
var OBSTRUCT_WIDTH = 100;
var OBSTRUCT_HEIGHT = 60;

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
    this.x = ITEM_X;
    this.y = ITEM_Y;
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
    if (this.x <player.x + ITEM_WIDTH && this.x > player.x - ITEM_WIDTH && this.y < player.y + ITEM_HEIGHT && this.y >player.y - ITEM_HEIGHT) {
        return true;
    }
};

//declare new item
var item = new Item();

/**************** Obstruction Code ****************/
var Obstruction = function () {
    this.x = OBSTRUCT_X;
    this.y = OBSTRUCT_Y;
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
        } else if (this.x < BOUNDX_LEFT){
            this.direction = "right";
        }
    }
    if (this.x > BOUNDX_RIGHT) {
        this.direction = "left";
    } else if (this.x < BOUNDX_LEFT){
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
    this.x = PLAYER_X;
    this.y = PLAYER_Y;
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
            if (obstruction.barrier() === true && this.x === (OBSTRUCT_X + OBSTRUCT_WIDTH) && this.y === OBSTRUCT_Y) {
            //Stay in bounds of screen
            } else if (obstruction.barrier() === true && this.x - HORIZONTAL > BOUNDX_LEFT && (this.y !== OBSTRUCT_Y || this.x !== (OBSTRUCT_X + OBSTRUCT_WIDTH))) {
                this.x -= HORIZONTAL;
            //*Barrier not present
            //Stay in map bounds
            } else if (obstruction.barrier() === false && this.x - HORIZONTAL < BOUNDX_LEFT) {
            //Do not walk into water
            } else if (obstruction.barrier() === false && this.x === OBSTRUCT_X && this.y < OBSTRUCT_Y) {
            } else if (obstruction.barrier() === false && this.x - HORIZONTAL > BOUNDX_LEFT) {
                this.x -= HORIZONTAL;
            }
            break;
        case "right":
            //*Barrier Present//
            //Stay in map bounds
            if (obstruction.barrier() === true && this.x + HORIZONTAL > BOUNDX_RIGHT) {
            //Do not walk into barrier
            } else if (obstruction.barrier() === true && this.x === (OBSTRUCT_X - OBSTRUCT_WIDTH) && this.y === OBSTRUCT_Y) {
            //Allow movement if barrier not in the way
            } else if (obstruction.barrier() === true && (this.x !== (OBSTRUCT_X - OBSTRUCT_WIDTH) || this.y !== OBSTRUCT_Y)) {
                this.x += HORIZONTAL;
            //*Barrier Removed//
            //Stay in map bounds
            } else if (obstruction.barrier() === false && this.x + HORIZONTAL > BOUNDX_RIGHT) {
            //Do not walk in water
            } else if (obstruction.barrier() === false && this.x + HORIZONTAL > (OBSTRUCT_X - OBSTRUCT_WIDTH) && this.y < OBSTRUCT_Y) {
            } else if (obstruction.barrier() === false && this.x + HORIZONTAL < BOUNDX_RIGHT) {
                this.x += HORIZONTAL;
            }
            break;
        case "up":
            //*Barrier Present//
            //Stop from walking into barrier if barrier is present
            if (this.x === (OBSTRUCT_X) && obstruction.barrier() === true && this.y - VERTICAL < (OBSTRUCT_Y + OBSTRUCT_HEIGHT)) {
            } else if (this.x === (OBSTRUCT_X) && obstruction.barrier() === true && this.y.VERTICAL > (OBSTRUCT_Y + OBSTRUCT_HEIGHT) && this.y - VERTICAL < BOUNDY_TOP) {
            //prevent player from walking into water
            } else if (this.x !== (OBSTRUCT_X) && obstruction.barrier() === true && this.y - VERTICAL < OBSTRUCT_Y) {
            //***Barrier Removed//
            //Allow player to walk upwards if barrier is removed
            } else if (this.x === (OBSTRUCT_X) && obstruction.barrier() === false && this.y - VERTICAL < BOUNDY_TOP) {
            } else if (this.x !== (OBSTRUCT_X) && obstruction.barrier() === false && this.y - VERTICAL < OBSTRUCT_Y) {
            } else {
                this.y -= VERTICAL;
            }
            break;
        case "down":
            if (this.y + VERTICAL > BOUNDY_BOTTOM) {
            } else {
                this.y += VERTICAL;
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
    this.x = PLAYER_X;
    this.y = PLAYER_Y;
    newGame.endGame = false;
    newGame.winGame = false;
};

//*******  Check for collisions
Player.prototype.collide = function () {
    for(var i = 0; i < allEnemies.length; i++) {
        if (this.x < allEnemies[i].x + ENEMY_WIDTH && this.x > allEnemies[i].x - ENEMY_WIDTH && this.y < allEnemies[i].y + ENEMY_HEIGHT && this.y > allEnemies[i].y - ENEMY_HEIGHT) {
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
