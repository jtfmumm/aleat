//    (c) 2013 john mumm
//    <jtfmumm{at}gmail{dot}com>
//    http://github.com/jtfmumm/aleat

//  Generate Markov grid from input song analysis

load('RhinoFileUtilities.js');

(function markovAnalyze() {
    var i,
        markovRaw = [],
        markovGrid = [],
        importSong = [];

    importSong = txtToArray('folksongs.txt', false);
    importSong = notesToNumbers(importSong);
    markovRaw = populateMarkovRaw(importSong).slice();
    markovGrid = populateMarkovAnalysis(markovRaw).slice();

    for (i = 0; i < markovGrid[0].length; i++) {
        print(markovGrid[i]);
    }
}());

function notesToNumbers(importSong) {
    var i;
    for (i = 0; i < importSong.length; i++) {
        switch (importSong[i]) {
            case 'g':
                importSong[i] = 0;
                break;
            case 'a':
                importSong[i] = 2;
                break;
            case 'b':
                importSong[i] = 4;
                break;
            case 'c':
                importSong[i] = 5;
                break;
            case 'd':
                importSong[i] = 7;
                break;
            case 'e':
                importSong[i] = 9;
                break;
            case 'f':
                importSong[i] = 11;
                break;
        }
    }

    return importSong;
}

function populateMarkovRaw(importSong) {
    var i, j, currStep, nextStep,
        markovRaw = [];

    //initialize markovRaw
    for ( i=0; i < 12; i++) {
        markovRaw[i] = [];
        for( j=0; j < 12; j++) {
            markovRaw[i][j] = 0;
        }
    }

    for ( i=0; i < importSong.length - 1; i++) {
        currStep = importSong[i];
        nextStep = importSong[i+1];
        markovRaw[currStep][nextStep]++;
    }

    currStep = importSong[importSong.length - 1];  //loop from last to first member of song array to avoid function freezing
    nextStep = importSong[0];
    markovRaw[currStep][nextStep]++;

    return markovRaw;
}

function populateMarkovAnalysis(markovRaw) {
    var i, j, tempRaw = 0, tempTotal = 0,
        rowTotal = 0,
        markovAnalysis = [];

    //initialize markovAnalysis
    for ( i=0; i < 12; i++) {
        markovAnalysis[i] = [];
        for( j=0; j < 12; j++) {
            markovAnalysis[i][j] = 0;
        }
    }

    for ( i=0; i < 12; i++) {
        for ( j=0; j < 12; j++) {
            rowTotal = rowTotal + markovRaw[i][j];
        }
        for ( j=0; j < 12; j++) {
            if(rowTotal > 0) {
                tempRaw = (markovRaw[i][j]);
                tempTotal = (rowTotal);
                markovAnalysis[i][j] = (tempRaw / tempTotal) * 100;  //turn probability varo percentage
                //prvar(markovAnalysis[i][j]);
            }
        }
        rowTotal = 0;
    }

    return markovAnalysis;
}