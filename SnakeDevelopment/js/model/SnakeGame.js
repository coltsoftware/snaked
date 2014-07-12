/**
 * Created by Alan on 08/06/2014.
 */

function SnakeGame(params) {
    function createArray(length) {
        var arr = new Array(length || 0),
            i = length;

        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while (i--) arr[length - 1 - i] = createArray.apply(this, args);
        }

        return arr;
    }

    this.boardWidth = params.boardWidth;
    this.boardHeight = params.boardHeight;
    var gridObjects = createArray(params.boardWidth, params.boardHeight);

    this.placeApple = function (x, y) {
        if (this.grid(x, y) !== undefined)return false;
        this.place(x, y, new Apple());
        return true;
    };

    this.insertAppleOnNextBlank = function (x, y) {
        for (var iy = 0; iy < this.boardHeight; iy++)
            for (var ix = 0; ix < this.boardWidth; ix++)
                if (this.placeApple((ix + x) % this.boardWidth, (iy + y) % this.boardHeight))
                    return true;

        return false;
    };

    this.placeNApples = function (n) {
        for (var i = 0; i < n; i++) {
            var x = Math.floor(Math.random() * this.boardWidth);
            var y = Math.floor(Math.random() * this.boardHeight);
            if (!this.insertAppleOnNextBlank(x, y)) return false;
        }
        return true;
    };

    var consumedAppleThisStep = false;

    this.consume = function (x, y) {
        gridObjects[x][y] = undefined;
        consumedAppleThisStep = true;
    };

    this.grid = function (x, y) {
        return gridObjects[x][y];
    };

    this.place = function (x, y, object) {
        gridObjects[x][y] = object;
    };

    this.snake = new Snake(params, this);

    var state = State.Running;

    this.getState = function () {
        return state;
    };

    this.pause = function () {
        state = State.Paused;
    };

    this.resume = function () {
        state = State.Running;
    };

    var lives = params.lives;
    if (params.lives === undefined)
        lives = 3;

    this.loseLife = function () {
        lives--;
    };

    this.getLives = function () {
        return lives;
    };

    this.isDead = function () {
        return lives <= 0;
    };

    var lastDeathDirection = undefined;

    this.step = function () {
        consumedAppleThisStep = false;
        if (lastDeathDirection !== undefined) {
            if (lastDeathDirection == this.snake.getDirection())
                return false;
        }

        lastDeathDirection = undefined;
        this.resume();

        var snakeDidMove = this.snake.moveFull();
        if (snakeDidMove) {
            if (consumedAppleThisStep && this.countApples() === 0) {
                this.placeNApples(10);
                if (lives < 3)
                    lives++;
            }
        }
        else {
            this.pause();
            this.loseLife();
            lastDeathDirection = this.snake.getDirection();
        }
        return snakeDidMove;
    };

    this.setDirection = function (direction) {
        if (lastDeathDirection !== undefined) {
            if (lastDeathDirection == direction)
                return false;
        }
        return this.snake.setDirection(direction);
    };

    this.countApples = function () {
        var appleCount = 0;
        for (var x = 0; x < this.boardWidth; x++)
            for (var y = 0; y < this.boardHeight; y++)
                if (this.grid(x, y) instanceof Apple)
                    appleCount++;
        return appleCount;
    };
}

State = {
    Paused: 0,
    Running: 1
};