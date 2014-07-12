/**
 * Created by Alan on 15/06/2014.
 */

function ListDrawable() {

    var drawables = [];

    this.add = function (drawable) {
        drawables.push(drawable);
    };

    this.clear = function () {
        drawables = [];
    };

    this.draw = function (context) {
        for (var i = 0; i < drawables.length; i++)
            drawables[i].draw(context);
    };
}