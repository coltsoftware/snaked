/**
 * Created by Alan on 12/06/2014.
 */

function ControlStickDrawable() {

    var outerRadius = 30;
    var maxDistance = 10;
    var innerRadius = outerRadius - maxDistance;

    var md2 = maxDistance * maxDistance;

    var _x = 0;
    var _y = 0;
    var _drawX = 0;
    var _drawY = 0;

    this.getX = function () {
        return _x;
    };
    this.getY = function () {
        return _y;
    };

    this.setPosition = function (x, y) {
        _x = x;
        _y = y;
        var d2 = x * x + y * y;
        return d2 >= md2;
    };

    this.getDrawX = function () {
        return _drawX;
    };
    this.getDrawY = function () {
        return _drawY;
    };

    this.setDrawPosition = function (x, y) {
        _drawX = x;
        _drawY = y;
    };

    this.draw = function (context) {
        this.drawAt(context, _drawX, _drawY);
    };

    this.drawAt = function (context, drawX, drawY) {
        context.save();
        context.translate(drawX, drawY);
        drawStickArea(context);
        var x = _x;
        var y = _y;
        var d2 = x * x + y * y;
        var active = false;
        if (d2 > md2) {
            var d = Math.sqrt(d2);
            var ratio = maxDistance / d;
            x *= ratio;
            y *= ratio;
            active = true;
        }
        context.translate(x, y);
        drawStick(context, active);
        context.restore();
    };

    function drawStick(context, active) {
        context.beginPath();
        var radius = innerRadius;
        context.arc(0, 0, radius, 0, 2 * Math.PI);
        context.strokeStyle = active ? "#cfcf00" : "#cf00cf";
        context.stroke();
    }

    function drawStickArea(context) {
        context.beginPath();
        var radius = outerRadius;
        context.arc(0, 0, radius, 0, 2 * Math.PI);
        context.strokeStyle = "#9f009f";
        context.stroke();
    }

    this.getOuterRadius = function () {
        return outerRadius;
    };
}