/**
 * Created by Alan on 15/06/2014.
 */

function GridDrawer(blockSize, gridSize) {
    var rectSize = blockSize - 1;

    this.drawRectangle = function (context, atX, atY, colour) {
        atX = (atX + context.x0) % gridSize.width;
        atY = (atY + context.y0) % gridSize.height;

        context.save();
        context.translate(blockSize * atX, blockSize * atY);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(rectSize, 0);
        context.lineTo(rectSize, rectSize);
        context.lineTo(0, rectSize);
        context.fillStyle = colour;
        context.fill();
        context.restore();
    };

    this.drawTriangle = function (context, atX, atY, colour, facingDirection) {
        atX = (atX + context.x0) % gridSize.width;
        atY = (atY + context.y0) % gridSize.height;

        context.save();
        context.translate(blockSize * atX, blockSize * atY);
        context.beginPath();

        switch (facingDirection) {
            case Direction.Down:
            {
                context.moveTo(0, 0);
                context.lineTo(rectSize, 0);
                context.lineTo(rectSize / 2, rectSize);
                break;
            }
            case Direction.Up:
            {
                context.moveTo(0, rectSize);
                context.lineTo(rectSize, rectSize);
                context.lineTo(rectSize / 2, 0);
                break;
            }
            case Direction.Right:
            {
                context.moveTo(0, 0);
                context.lineTo(rectSize, rectSize / 2);
                context.lineTo(0, rectSize);
                break;
            }
            case Direction.Left:
            {
                context.moveTo(rectSize, 0);
                context.lineTo(rectSize, rectSize);
                context.lineTo(0, rectSize / 2);
                break;
            }
        }

        context.fillStyle = colour;
        context.fill();
        context.restore();
    };

    this.draw = function (context,  atX, atY, drawable) {
        atX = (atX + context.x0) % gridSize.width;
        atY = (atY + context.y0) % gridSize.height;

        context.save();
        context.translate(blockSize * atX, blockSize * atY);
        drawable.draw(context);
        context.restore();
    };
}