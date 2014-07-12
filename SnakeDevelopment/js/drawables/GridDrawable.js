/**
 * Created by Alan on 07/06/2014.
 */

function GridDrawable(params) {

    this.color = params.color === undefined ? "#7f7f7f" : params.color;

    this.size = params.size === undefined ? 10 : params.size;

    this.draw = function (context) {
        var size = this.size;

        context.save();

        context.strokeStyle = this.color;

        var startX = 0;
        var startY = 0;
        if (context.x0px !== undefined)
            startX = context.x0px % size;
        if (context.y0px !== undefined)
            startY = context.y0px % size;

        for (var y = startY; y <= 320; y += size) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(320, y);
            context.stroke();
        }

        for (var x = startX; x <= 320; x += size) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, 320);
            context.stroke();
        }

        context.restore();
    };
}