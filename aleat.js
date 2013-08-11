
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
    instrument: 1,
    range: 4,
    parts: 4,
    scale: 'mPenta',
    style: 'lead',
    curPart: 0,

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

    //Options object
    options: {
        instrument: [],
        range: [],
        scale: [],
        style: [],
        rootTone: []
        //algo: []
    },

    //Algorithm names
    algos: ['Markov', 'Repetitive'],

    tones: {
        0: {
            name: 'c',
            value: 0
        },
        1: {
            name: 'c#',
            value: 1
        },
        2: {
            name: 'd',
            value: 2
        },
        3: {
            name: 'd#',
            value: 3
        },
        4: {
            name: 'e',
            value: 4
        },
        5: {
            name: 'f',
            value: 5
        },
        6: {
            name: 'f#',
            value: 6
        },
        7: {
            name: 'g',
            value: 7
        },
        8: {
            name: 'g#',
            value: 8
        },
        9: {
            name: 'a',
            value: 9
        },
        10: {
            name: 'a#',
            value: 10
        },
        11: {
            name: 'b',
            value: 11
        }
    },

    //Scale presets
    scales: {
        //scale-grid combinations
        mPenta: {
            name: 'Minor Pentatonic',
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
            name: 'Major Pentatonic',
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
            name: 'Major Folk',
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
            name: 'Lead',
            noteValues: ['4', '4', '4', '4', '4', '4', '4', '4', '8', '8', '8', '8', '16', '16', '2']
        },
        bass: {
            name: 'Bass',
            noteValues: ['4', '4', '4', '4', '4', '4', '4', '4', '8', '8', '8', '8', '2', '2', '2']
        },
        crazy: {
            name: 'Crazy',
            noteValues: ['5', '5', '5', '5', '7', '7', '7', '7', '17', '17', '17', '17', '3', '3']
        }
    },

    //MIDI Instruments
    instruments: {
        1: {
            name: 'Piano'
        },
        7: {
            name: 'Harpsichord'
        },
        19: {
            name: 'Organ'
        },
        33: {
            name: 'Bass'
        },
        41: {
            name: 'Violin'
        },
        43: {
            name: 'Cello'
        },
        81: {
            name: 'Square Wave'
        },
        82: {
            name: 'Saw Wave'
        },
        89: {
            name: 'Pad'
        },
        105: {
            name: 'Sitar'
        },
        113: {
            name: 'Bell'
        }
    },

    ranges: {
        soprano: {
            name: 'Soprano',
            range: 5 //[c4, c6]
        },
        alto: {
            name: 'Contralto',
            range: 4 //[f3, f5]
        },
        tenor: {
            name: 'Tenor',
            range: 3 //[c3, c5]
        },
        bass: {
            name: 'Bass',
            range: 2 //[f2, f4]
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

    aleat.applyStyle(aleat.curPart);

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
        aleat.applyStyle(aleat.curPart);
        _song.push('ch' + aleat.curPart);
        _song.push('i' + aleat.instrument);

        for (i = 0; i < aleat.duration * 12; i++) {
            rolledNoteValue = aleat.changeNoteValue();
            if (rolledNoteValue !== curNoteValue) {
                curNoteValue = rolledNoteValue;
                _song.push('o/' + curNoteValue);
            }
            _song.push(aleat.transposition[0] + aleat.range);
        }
        _song.push('|');
        aleat.parts--;
        aleat.curPart++;
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
        aleat.applyStyle(aleat.curPart);
        _song.push('ch' + aleat.curPart);
        _song.push('i' + aleat.instrument);

        for (i = 0; i < (aleat.duration * 12); i++) {
            //change note value
            rolledNoteValue = aleat.changeNoteValue();
            if (rolledNoteValue !== curNoteValue) {
                curNoteValue = rolledNoteValue;
                _song.push('o/' + curNoteValue);
            }
            //add markov state to song
            _song.push(aleat.transposition[aleat.scaleRow[markovState]] + aleat.range);
            //change markov state
            markovState = aleat.changeMarkovState(markovState);
        }
        _song.push('|');
        aleat.parts--;
        aleat.curPart++;
    }
    return _song;
};

//
//GENERATION HELPERS
//

//Re-initialize aleat.options
aleat.reInit = function() {
    aleat.options.rootTone = [];
    aleat.options.scale = [];
    aleat.options.style = [];
    aleat.options.algo = [];
    aleat.options.range = [];
    aleat.options.instrument = [];
    aleat.curPart = 0;

};

//Change settings based on user input
aleat.applyStyle = function(cur) {
    var i, n,
        scale,
        style,
        tempTones = [];

    aleat.style = aleat.options.style[cur];
    aleat.scale = aleat.options.scale[cur];
    aleat.rootTone = aleat.options.rootTone[cur];
    aleat.instrument = aleat.options.instrument[cur];

    //Set range
    var tempRange = aleat.options.range[cur];
    aleat.range = aleat.ranges[tempRange].range;

    scale = aleat.scale;
    style = aleat.style;

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

aleat.updateOptions = function(cur) {
    aleat.style = aleat.options.style[cur];
    aleat.scale = aleat.options.scale[cur];
    aleat.rootTone = aleat.options.rootTone[cur];
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







