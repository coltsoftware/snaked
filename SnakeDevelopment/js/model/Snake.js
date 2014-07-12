/**
 * Created by Alan on 08/06/2014.
 */

function Snake(params, gameBoard) {
    var self = this;

    var boardX = params.boardWidth;
    var boardY = params.boardHeight;
    var size = params.initialSize;

    this.updateGameboard = function () {
        if (gameBoard === undefined) return;
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            gameBoard.place(part.getX(), part.getY(), part);
        }
    };

    var directionQueue = new function () {

        this.direction = Direction.Up;
        this.nextDirection = null;
        this.lastDirection = Direction.Up;
        this.consumed = true;

        this.setFirstDirection = function (newDirection) {
            if (this.opposite(newDirection) == this.lastDirection) {
                return false;
            }
            this.direction = newDirection;
            this.nextDirection = null;
            this.consumed = false;
            return true;
        };

        this.peek = function () {
            return this.direction;
        };

        this.consume = function () {
            this.lastDirection = this.direction;
            this.consumed = true;
            if (this.nextDirection !== null) {
                this.direction = this.nextDirection;
                this.nextDirection = null;
            }
        };

        this.push = function (newDirection) {

            if (this.consumed)
                return this.setFirstDirection(newDirection);

            if (newDirection == this.direction) {
                // already going in this direction
                return true;
            }

            if (this.opposite(newDirection) == this.direction) {
                // we let them flip without chaining
                // because to chain this means for example, UP->DOWN
                return this.setFirstDirection(newDirection);
            }

            this.nextDirection = newDirection;
            return true;
        };

        this.opposite = function (direction) {
            switch (direction) {
                case Direction.Up:
                    return Direction.Down;
                case Direction.Down:
                    return Direction.Up;
                case Direction.Left:
                    return Direction.Right;
                case Direction.Right:
                    return Direction.Left;
            }
        };

        this.reset = function () {
            this.nextDirection = null;
            this.consumed = true;
        };

    };


    if (size === undefined)
        size = 3;

    var parts = [];

    this.addPart = function (x, y, direction) {
        var part = new SnakePart(x, y, direction);
        parts.push(part);
        return part;
    };

    for (var i = 0; i < size; i++) {
        this.addPart(10, 5 + i, Direction.Up);
    }

    this.updateGameboard();

    this.length = function () {
        return parts.length;
    };

    this.getHead = function () {
        return parts[0];
    };

    this.getPart = function (partNo) {
        return parts[partNo];
    };

    this.moveFull = function () {
        var head = this.getHead();
        var newSegment = function (direction) {
            var x = head.getX();
            var y = head.getY();
            if (direction == Direction.Left) {
                x--;
                x = (x + boardX) % boardX;
            } else if (direction == Direction.Right) {
                x++;
                x %= boardX;
            } else if (direction == Direction.Down) {
                y++;
                y %= boardY;
            } else if (direction == Direction.Up) {
                y--;
                y = (y + boardY) % boardY;
            }
            return new SnakePart(x, y, direction);
        };

        var newHead = newSegment(directionQueue.peek());

        if (this.canMove(newHead)) {
            directionQueue.consume();
            parts.unshift(newHead);
            if (gameBoard === undefined || !(gameBoard.grid(newHead.getX(), newHead.getY()) instanceof Apple)) {
                var last = parts.pop();
                if (gameBoard !== undefined) {
                    gameBoard.place(last.getX(), last.getY(), undefined);
                }
            }
            else {
                gameBoard.consume(newHead.getX(), newHead.getY());
            }
            if (gameBoard !== undefined) {
                gameBoard.place(newHead.getX(), newHead.getY(), newHead);
            }
            return true;
        }
        this.getHead().setDeathMarker(true);
        directionQueue.reset();
        return false;
    };

    this.canMove = function (newHead) {
        if (gameBoard === undefined) return true;
        return !(gameBoard.grid(newHead.getX(), newHead.getY()) instanceof SnakePart);
    };

    this.setDirection = function (newDirection) {
        return directionQueue.push(newDirection);
    };

    this.getDirection = function () {
        return directionQueue.peek();
    };
}

Direction = {
    Up: 0,
    Down: 1,
    Left: 2,
    Right: 3
};