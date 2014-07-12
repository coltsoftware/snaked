/**
 * Created by evansa on 23/06/2014.
 */

function GameSerializer() {

    var g;

    var serApples = function (game) {
        var apples = [];
        for (var y = 0; y < game.boardHeight; y++)
            for (var x = 0; x < game.boardWidth; x++)
                if (game.grid(x, y) instanceof Apple)
                    apples.push({ax: x, ay: y});
        return apples;
    };

    var serSnake = function (game) {
        var snake = [];
        for (var i = 0; i < game.snake.length(); i++) {
            var part = game.snake.getPart(i);
            snake.push(
                {
                    sx: part.getX(),
                    sy: part.getY(),
                    d: part.getPlacementDirection(),
                    dm: part.isDeathMarker()
                });
        }
        return snake;
    };

    this.serialize = function (game) {
        var res = {
            lives: game.getLives(),
            width: game.boardWidth,
            height: game.boardHeight,
            apples: serApples(game),
            snake: serSnake(game)
        };
        return JSON.stringify(res);
    };

    this.deserialize = function (jsonstr) {
        var data = JSON.parse(jsonstr);

        var game = new SnakeGame({
            boardWidth: data.width,
            boardHeight: data.height,
            lives: data.lives, initialSize: 0});

        for (var aidx in data.apples) {
            var apple = data.apples[aidx];
            game.placeApple(apple.ax, apple.ay);
        }

        for (var sidx in data.snake) {
            var snakePart = data.snake[sidx];
            game.snake.addPart(snakePart.sx, snakePart.sy, snakePart.d).setDeathMarker(snakePart.dm);
        }

        game.snake.updateGameboard();

        return game;
    };
}