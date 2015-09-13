// Enemies our player must avoid
var Enemy = function(locx, locy, speed) {
    this.x=locx;
    this.y=locy;
    this.speed=speed;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed*dt;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//TODO: function to check collisions

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

//Create player class
var Player = function (){
    //Player initial location
    var playerX=250;  //canvas width is 505
    var playerY=300;  //canvas height is 606
    this.x=playerX;
    this.y=playerY;
    this.sprite = 'images/char-horn-girl.png';
};

//Update player's position
Player.prototype.update = function(dt) {
    //use same dt parameter as enemy
    //ensure that game runs at same speed across various computers
};

//Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(keycode){
    var horizontal = 100;
    var vertical = 100;

    if(keycode === 'left'){
        this.x -= horizontal;
    }
    if(keycode === 'right'){
        this.x = horizontal;
    }
    if(keycode === 'up'){
        this.x -= vertical;
    }
    if(keycode === 'down'){
        this.x = vertical;
    }
};
//**********************************************//

// Now instantiate your objects.


// Place all enemy objects in an array called allEnemies
var allEnemies= [];

// Place the player object in a variable called player
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
