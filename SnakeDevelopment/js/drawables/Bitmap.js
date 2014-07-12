/**
 * Created by Alan on 16/06/2014.
 */

function Bitmap(width, height) {
    var canvas = document.createElement("CANVAS");
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    this.draw = function (context) {
        context.drawImage(this.canvas, 0, 0);
    };

    this.load = function(imageFileName)
    {
        var context = this.context;
        var img = new Image();
        img.onload = function () {
            context.drawImage(img, 0, 0);
        };
        img.src = imageFileName;
    }
}