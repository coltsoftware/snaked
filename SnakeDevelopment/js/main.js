var Config = {
    pauseTextColor: '#ffffff',
    gameOverTextColor: '#ff5f5f',
    highScoreColor: "#00ff00",
    nonHighScoreColor: "#ffff00",
    textStroke: 'blue'
};

var Game = {
    self: this,
    canvas: null,
    context: null,
    grid: null,
    snakeBoard: null,
    snake: null,
    snakeBlockSize: 16,
    nextMove: undefined,
    gridDrawer: undefined,
    gameFps: 8,
    drawables: new ListDrawable(),
    gameDrawables: new ListDrawable(),
    isChrome: false,

    init: function () {
        this.isChrome = window.chrome

        this.establishFonts();

        this.mspf = 1000 / this.gameFps;

        var drawables = this.drawables;

        var minGrid = this.snakeBlockSize;
        drawables.add(new GridDrawable({color: "#00007f", size: minGrid}));
        drawables.add(new GridDrawable({color: "#00008f", size: minGrid * 4}));
        drawables.add(new GridDrawable({color: "#00009f", size: minGrid * 8}));

        drawables.add(this.gameDrawables);

        {
            var rectSize = minGrid;
            var bmp = new Bitmap(rectSize, rectSize);
            bmp.load(minGrid == 16 ? 'apple_16.png' : 'apple_32.png');
            this.appleDrawable = bmp;
        }

        {
            var rectSize = minGrid - 1;
            var bmp = new Bitmap(rectSize, rectSize);
            var context = bmp.context;
            context.fillStyle = "#00ff00";
            context.beginPath();
            context.moveTo(0, rectSize);
            context.lineTo(rectSize, rectSize);
            context.lineTo(rectSize / 2, 0);
            context.fill();
            this.livesDrawable = bmp;
        }

        this.localData = new LocalData();
        this.highscore = new HighScore(this.localData);

        this.newGame();

        this.stick = new ControlStickDrawable();
        this.stick.setDrawPosition(320 / 2, 320 / 2);

        this.hookUpSwipes(this.canvas, this);
        if (this.isChrome && this.watch !== null)
            this.hookUpSwipes(this.watch, this);

        this.controlOffset = 10 + this.stick.getOuterRadius();

        this.snakeBoard.pause();

    },

    clear: function () {
        var context = this.context;
        context.fillStyle = "black";
        context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    },

    hookUpSwipes: function (element, game) {
        var self = this;
        var stick = game.stick;

        Hammer(element).on("dragend", function (evt) {
            stick.setPosition(0, 0);
        });

        Hammer(element).on("doubletap", function (evt) {
            self.newGameIfDead();
        });

        Hammer(element).on("drag", function (evt) {
            var controlSensitivity = 1 / 2;
            if (!stick.setPosition(evt.gesture.deltaX * controlSensitivity, evt.gesture.deltaY * controlSensitivity))
                return;
            var direction = evt.gesture.direction;
            if (direction == "up")
                self.alterDirection(Direction.Up);
            else if (direction == "down")
                self.alterDirection(Direction.Down);
            else if (direction == "left")
                self.alterDirection(Direction.Left);
            else if (direction == "right")
                self.alterDirection(Direction.Right);
        });
    },

    newGame: function () {
        var drawables = this.gameDrawables;

        drawables.clear();

        this.snakeBoard = null;

        var existingGame = this.localData.read("game");
        if (existingGame != null) {
            this.localData.write("game", null);
            try {
                this.snakeBoard = new GameSerializer().deserialize(existingGame);
            }
            catch (ex) {
                this.snakeBoard = null;
            }
        }

        if (this.snakeBoard === null) {
            var params = {boardWidth: Math.ceil(320 / this.snakeBlockSize),
                boardHeight: Math.ceil(320 / this.snakeBlockSize),
                initialSize: 10};
            this.snakeBoard = new SnakeGame(params);
        }

        this.snake = this.snakeBoard.snake;

        this.gridDrawer = new GridDrawer(this.snakeBlockSize, {width: this.snakeBoard.boardWidth, height: this.snakeBoard.boardHeight});
        var gridDrawer = this.gridDrawer;
        drawables.add(new SnakeDrawable(this.snake, gridDrawer));
        drawables.add(new ApplesDrawable(this.snakeBoard, gridDrawer, this.appleDrawable));
        if (this.snakeBoard.countApples() == 0)
            this.snakeBoard.placeNApples(10);
    },

    newGameIfDead: function () {
        if (this.snakeBoard.isDead()) {
            this.newGame();
        }
    },

    alterDirection: function (direction) {
        if (!this.snakeBoard.isDead()) {
            if (this.snakeBoard.setDirection(direction))
                this.snakeBoard.resume();
        }
    },

    process: function (miliseconds) {
        var mspf = this.mspf;
        if (this.nextMove != undefined) {
            var delta = this.nextMove - miliseconds;
            this.partFrame = 1 - delta / mspf;
            //console.log(this.partFrame);
            if (delta >= 0) return;
            this.partFrame = 0;
        }
        if (this.snakeBoard.getState() != State.Paused) {
            this.snakeBoard.step();
            this.highscore.updateScore(this.snake.length());
        }
        this.nextMove = miliseconds + mspf;// Math.floor(miliseconds / mspf + 1) * mspf;
    },

    draw: function () {
        var snake = this.snake;
        var board = this.snakeBoard;
        var context = this.context;
        context.save();

        this.clear();

        this.headCentre = snake.getPart(1);
        context.x0 = (0 - this.headCentre.getX() + this.snakeBoard.boardWidth * 1.5) % this.snakeBoard.boardWidth;
        context.y0 = (0 - this.headCentre.getY() + this.snakeBoard.boardHeight * 1.5) % this.snakeBoard.boardHeight;

        if (board.getState() == State.Running && !snake.getHead().isDeathMarker()) {
            //Smooth scrolling
            var dir = snake.getHead().getPlacementDirection();
            switch (dir) {
                case Direction.Left:
                    context.x0 += this.partFrame;
                    break;
                case Direction.Right:
                    context.x0 -= this.partFrame;
                    break;
                case Direction.Down:
                    context.y0 -= this.partFrame;
                    break;
                case Direction.Up:
                    context.y0 += this.partFrame;
                    break;
            }
        }

        context.x0px = context.x0 * this.snakeBlockSize;
        context.y0px = context.y0 * this.snakeBlockSize;

        this.drawables.draw(context);

        var offset = this.controlOffset;
        this.stick.drawAt(context, offset, 320 - offset);
        this.stick.drawAt(context, 320 - offset, 320 - offset);

        var lives = this.snakeBoard.getLives();

        {
            var isHigh = this.highscore.getHighScore() == this.snake.length();
            var top = -80;
            if (board.getState() == State.Paused) {
                context.textAlign = "center";
                if (this.snakeBoard.isDead()) {
                    context.fillStyle = isHigh ? Config.highScoreColor : Config.gameOverTextColor;
                    this.setFontSize(30);
                    this.strokeText(Config.textStroke, isHigh ? Config.highScoreColor : Config.gameOverTextColor,
                        isHigh ? "New High Score" : "Game over", 320 / 2, 320 / 2 + top);
                    this.setFontSize(20);
                    this.strokeText(Config.textStroke, isHigh ? Config.highScoreColor : Config.gameOverTextColor,
                        "Double tap to restart", 320 / 2, 320 / 2 + 20 + 5 + top);
                }
                else {
                    context.fillStyle = Config.pauseTextColor;
                    this.setFontSize(30);
                    var liveText = (lives > 1) ? (lives + " lives left") : (lives + " life left");
                    this.strokeText(Config.textStroke, Config.pauseTextColor, liveText, 320 / 2, 320 / 2 + top);
                    this.setFontSize(20);
                    this.strokeText(Config.textStroke, Config.pauseTextColor, "Swipe to resume", 320 / 2, 320 / 2 + 20 + 5 + top);
                }
            }
            context.textAlign = "end";

            this.setFontSize(20);
            this.strokeText(Config.textStroke, isHigh ? Config.highScoreColor : Config.nonHighScoreColor,
                    "" + this.snake.length(), 320 - 5, 20);
            this.setFontSize(15);
            this.strokeText(Config.textStroke, isHigh ? Config.highScoreColor : Config.nonHighScoreColor,
                    "" + this.highscore.getHighScore(), 320 - 5, 20 + 15 + 5);
        }

        context.x0 = 0;
        context.y0 = 0;
        for (var l = 0; l < lives; l++)
            this.gridDrawer.draw(context, l, 0, this.livesDrawable);

        context.restore();
    },

    fonts: new Array(),

    establishFonts: function () {
        this.fonts[10] = this.isChrome ? "10px Verdana" : "10px Samsung Sans";
        this.fonts[15] = this.isChrome ? "15px Verdana" : "15px Samsung Sans";
        this.fonts[20] = this.isChrome ? "20px Verdana" : "20px Samsung Sans";
        this.fonts[30] = this.isChrome ? "30px Verdana" : "30px Samsung Sans";
    },

    setFontSize: function (size) {
        this.context.font = this.fonts[size];
    },

    strokeText: function (strokeStyle, fillStyle, text, x, y) {
        var context = this.context;
        context.lineWidth = 2;
        context.strokeStyle = strokeStyle;
        context.strokeText(text, x, y);
        context.fillStyle = fillStyle;
        context.fillText(text, x, y);
        context.lineWidth = 1;
    }
};

window.onload = function () {
    Game.canvas = document.querySelector("#gameArea");
    Game.watch = document.querySelector("#watch");
    Game.title = document.querySelector("#title");
    Game.context = Game.canvas.getContext("2d");
    var width = document.width;
    if (document.width == undefined)
        width = 320;
    Game.clockRadius = width / 2;

    //Assigns the area that will use Canvas
    Game.canvas.width = width;
    Game.canvas.height = width;

    //add eventListener for tizenhwkey
    window.addEventListener('tizenhwkey', function (e) {
        if (e.keyName == "back")
            Game.localData.write("game", new GameSerializer().serialize(Game.snakeBoard));
        tizen.application.getCurrentApplication().exit();
    });

    hookUpBrowseKeyPress();

    Game.init();

    gameLoop();
}

function gameLoop() {
    Game.process(new Date().getTime());
    Game.draw();

    var fps = 30;
    setTimeout(function () {
        window.requestAnimationFrame(gameLoop);
        // Drawing code goes here
    }, 1000 / fps);
}

function hookUpBrowseKeyPress() {
    document.onkeydown = function (evt) {
        if (evt.keyCode == 37) {
            Game.alterDirection(Direction.Left);
        }
        if (evt.keyCode == 38) {
            Game.alterDirection(Direction.Up);
        }
        if (evt.keyCode == 39) {
            Game.alterDirection(Direction.Right);
        }
        if (evt.keyCode == 40) {
            Game.alterDirection(Direction.Down);
        }
    };
}
