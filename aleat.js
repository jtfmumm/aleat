
//    aleat: algorithmic music generator.
//    v0.01
//    (c) 2013 john mumm
//    <jtfmumm{at}gmail{dot}com>
//    http://github.com/jtfmumm/aleat

'use strict';

//
//SETTINGS
//

var aleat = {
    //General settings with defaults
    tempo: 120,
    duration: 6,
    twelveTones: ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'],
    transposition: ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'],
    rootTone: 0,
    parts: 4,
    scale: 'mPenta',
    style: 'lead',

    //Initial scale and style settings
    noteValues: ['4', '4', '4', '4', '4', '4', '4', '4', '8', '8', '8', '8', '16', '16', '2'],
    markovGrid: [
        [5, 30, 20, 20, 25], //state 0 (total 100%)
        [25, 5, 30, 20, 20], //state 1 (total 100%)
        [20, 25, 5, 30, 20], //state 2 (total 100%)
        [20, 20, 25, 5, 30], //state 3 (total 100%)
        [30, 20, 20, 25, 5]  //state 4 (total 100%)
    ],
    scaleRow: [0, 3, 5, 7, 10],

    //Scale presets
    scales: {
        //scale-grid combinations
        mPenta: {
            grid: [
                [5, 30, 20, 20, 25], //state 0 (total 100%)
                [25, 5, 30, 20, 20], //state 1 (total 100%)
                [20, 25, 5, 30, 20], //state 2 (total 100%)
                [20, 20, 25, 5, 30], //state 3 (total 100%)
                [30, 20, 20, 25, 5]  //state 4 (total 100%)
            ],
            scaleRow: [0, 3, 5, 7, 10]
        },
        majPenta: {
            grid: [
                [5, 30, 20, 20, 25], //state 0 (total 100%)
                [25, 5, 30, 20, 20], //state 1 (total 100%)
                [20, 25, 5, 30, 20], //state 2 (total 100%)
                [20, 20, 25, 5, 30], //state 3 (total 100%)
                [30, 20, 20, 25, 5]  //state 4 (total 100%)
            ],
            scaleRow: [0, 2, 4, 7, 9]
        },
        majorFolk: {
            grid: [
                [30, 22, 9, 0, 20, 5, 14],      //state 0 (total 100%)
                [35, 19, 24, 6, 10, 0, 6],      //state 1 (total 100%)
                [14, 15, 22, 10, 25, 14, 0],    //state 2 (total 100%)
                [0, 0, 50, 7, 29, 14, 0],       //state 3 (total 100%)
                [23, 3, 17, 3, 34, 17, 3],      //state 4 (total 100%)
                [7, 16, 0, 5, 31, 23, 18],      //state 5 (total 100%)
                [56, 17, 0, 0, 9, 9, 9]         //state 6 (total 100%)
            ],
            scaleRow: [0, 2, 4, 5, 7, 9, 11]
        }
    },

    //Playing style presets
    styles: {
        lead: {
            noteValues: ['4', '4', '4', '4', '4', '4', '4', '4', '8', '8', '8', '8', '16', '16', '2']
        },
        bass: {
            noteValues: ['4', '4', '4', '4', '4', '4', '4', '4', '8', '8', '8', '8', '2', '2', '2']
        },
        crazy: {
            noteValues: ['5', '5', '5', '5', '7', '7', '7', '7', '17', '17', '17', '17', '3', '3']
        }
    }

};

//
//SONG GENERATION
//

//Main song generation code
aleat.genSong = function(algo) {
    var song = [],
        songFinal;

    aleat.applyStyle();
    song = algo();
    song.unshift(aleat.addTempo());

    songFinal = song.join(' ');
    return songFinal;
};

//Generates a sequence of the same note with varying note values
aleat.genRep = function() {
    var i,
        rolledNoteValue,
        curNoteValue = 0,
        _song = [];

    while (aleat.parts > 0) {
        for (i = 0; i < aleat.duration * 12; i++) {
            rolledNoteValue = aleat.changeNoteValue();
            if (rolledNoteValue !== curNoteValue) {
                curNoteValue = rolledNoteValue;
                _song.push('o/' + curNoteValue);
            }
            _song.push(aleat.transposition[0]);
        }
        _song.push('|');
        aleat.parts--;
    }

    return _song;
};

//Generates a song using a supplied Markov grid and scale (scaleRow)
aleat.genMarkov = function() {
    var i,
        markovState = 0,
        curNoteValue = 0,
        rolledNoteValue,
        _song = [];

    while (aleat.parts > 0) {
        for (i = 0; i < (aleat.duration * 12); i++) {
            //change note value
            rolledNoteValue = aleat.changeNoteValue();
            if (rolledNoteValue !== curNoteValue) {
                curNoteValue = rolledNoteValue;
                _song.push('o/' + curNoteValue);
            }
            //add markov state to song
            _song.push(aleat.transposition[aleat.scaleRow[markovState]]);
            //change markov state
            markovState = aleat.changeMarkovState(markovState);
        }
        _song.push('|');
        aleat.parts--;
    }
    return _song;
};

//
//GENERATION HELPERS
//

//Change settings based on user input
aleat.applyStyle = function() {
    var i, n,
        scale = aleat.scale,
        style = aleat.style,
        tempTones = [];

    //Apply transposition
    //come back: there's a bug here for rootTone values over 0
    for (i = aleat.rootTone; i < (aleat.rootTone + 12); i++) {
        n = i % 12;
        tempTones.push(aleat.twelveTones[n]);
    }

    aleat.transposition = tempTones.slice();

    //Apply scale settings
    aleat.markovGrid = aleat.scales[scale].grid.slice();
    aleat.scaleRow = aleat.scales[scale].scaleRow.slice();
    //Apply style settings
    aleat.noteValues = aleat.styles[style].noteValues.slice();
};

aleat.addTempo = function() {
    return 'tempo' + aleat.tempo;
};

aleat.changeNoteValue = function() {
    var roll;

    roll = aleat.rand(0, aleat.noteValues.length - 1);

    return aleat.noteValues[roll];
};

aleat.changeMarkovState = function(markovState) {
    var roll, i,
        range = 0;

    roll = aleat.rand(0, 100);
    for(i = 0; i < aleat.markovGrid[0].length; i++) {
        range += aleat.markovGrid[markovState][i];
        if (roll <= range) {
            return i;
        }
    }
    return i;
};

//
// UTILITIES
//

aleat.rand= function(from, to) {
    return Math.floor(Math.random()*(to-from+1)+from);
};







