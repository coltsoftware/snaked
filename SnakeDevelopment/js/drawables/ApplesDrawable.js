/**
 * Created by Alan on 15/06/2014.
 */

function ApplesDrawable(board, drawer, bitmap) {
    this.draw = function (context) {
        for (var y = 0; y < board.boardHeight; y++)
            for (var x = 0; x < board.boardWidth; x++)
                if (board.grid(x, y) instanceof Apple)
                    drawer.draw(context, x, y, bitmap);
    };
}