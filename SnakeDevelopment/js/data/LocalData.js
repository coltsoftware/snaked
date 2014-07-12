/**
 * Created by Alan on 16/06/2014.
 */

function LocalData() {

    var storage = window.localStorage;

    this.write = function (key, value) {
        if (value === undefined)
            storage.setItem(key, null);
        else
            storage.setItem(key, JSON.stringify(value));
    };

    this.read = function (key) {
        var data = storage.getItem(key);
        return JSON.parse(data);
    };

    this.clear = function () {
        storage.clear();
    };

}