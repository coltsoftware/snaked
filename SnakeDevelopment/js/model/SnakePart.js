/**
 * Created by Alan on 08/06/2014.
 */

function SnakePart(x, y, placementDirection) {

    var death = false;

    this.getX = function () {
        return x;
    };
    this.getY = function () {
        return y;
    };

    this.setDeathMarker = function (isDeath) {
        death = isDeath;
    };
    this.isDeathMarker = function () {
        return death;
    };

    this.getPlacementDirection = function () {
        return placementDirection;
    };

}