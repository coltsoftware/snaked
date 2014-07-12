/**
 * Created by Alan on 15/06/2014.
 */

function SnakeDrawable(snake, drawer) {
    this.draw = function (context) {
        for (var i = 0; i < snake.length(); i++) {
            var part = snake.getPart(i);
            drawer.drawTriangle(context, part.getX(), part.getY(), part.isDeathMarker() ? "#ff0000" : "#0000ff", part.getPlacementDirection());
        }
    };
}