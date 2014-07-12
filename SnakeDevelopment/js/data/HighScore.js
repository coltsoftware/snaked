/**
 * Created by Alan on 16/06/2014.
 */

function HighScore(dataConnection) {

    var highScore;

    this.getHighScore = function () {
        if (highScore === undefined)
            highScore = getHighScoreFromDatabase();
        return highScore;
    };

    var getHighScoreFromDatabase = function () {
        var score = dataConnection.read("highscore");
        return score === null ? 0 : score;
    };

    this.updateScore = function (newscore) {
        if (newscore <= this.getHighScore())return;
        highScore = newscore;
        dataConnection.write("highscore", newscore);
    };

}