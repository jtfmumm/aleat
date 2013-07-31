
//    aleat: algorithmic music generator.
//    v0.01
//    (c) 2013 john mumm
//    <jtfmumm{at}gmail{dot}com>
//    http://github.com/jtfmumm/aleat

function test() {alert('hi');}

var aleat = {
    //General settings with defaults
    tempo: 120,
    duration: 6,
    twelveTones: ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'],
    transposition: ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'],
    rootTone: 0,
    parts: 1,
    scale: 'mPenta',
    style: 'lead',

    //Style settings with defaults
    noteValues: ['4', '4', '4', '4', '4', '4', '4', '4', '8', '8', '8', '8', '16', '16', '2'],
    markovGrid: [
        [5, 30, 20, 20, 25], //state 0 (total 100%)
        [25, 5, 30, 20, 20], //state 1 (total 100%)
        [20, 25, 5, 30, 20], //state 2 (total 100%)
        [20, 20, 25, 5, 30], //state 3 (total 100%)
        [30, 20, 20, 25, 5]  //state 4 (total 100%)
    ],
    scaleRow: [0, 3, 5, 7, 10],

    //Scale defaults
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
                [30, 22, 9, 0, 20, 5, 14], //state 0 (total 100%)
                [35, 19, 24, 6, 10, 0, 6], //state 0 (total 100%)
                [14, 15, 22, 10, 25, 14, 0], //state 0 (total 100%)
                [0, 0, 50, 7, 29, 14, 0], //state 0 (total 100%)
                [23, 3, 17, 3, 34, 17, 3], //state 0 (total 100%)
                [7, 16, 0, 5, 31, 23, 18], //state 0 (total 100%)
                [56, 17, 0, 0, 9, 9, 9] //state 0 (total 100%)
            ],
            scaleRow: [0, 2, 4, 5, 7, 9, 11]
        }
    },
    //Playing styles
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

function applyStyle() {
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
}

function genSong(algo) {
    var song = [],
        songFinal;

    //Main routine
    applyStyle();
    song = algo();
    song.unshift(addTempo());

    return songFinal = song.join(' ');
}

//Generates a series of c-notes with varying note values
function genBoring() {
    var i,
        rolledNoteValue,
        curNoteValue = 0,
        _song = [];
    while (aleat.parts > 0) {
        for (i = 0; i < aleat.duration * 12; i++) {
            rolledNoteValue = changeNoteValue();
            if (rolledNoteValue != curNoteValue) {
                curNoteValue = rolledNoteValue;
                _song.push('o/' + curNoteValue);
            }
            _song.push(aleat.transposition[0]);
        }
        _song.push('|');
        aleat.parts--;
    }

    return _song;
}

//Generates a song using a supplied Markov grid and scale (scaleRow).
function genMarkov() {
    var i,
        markovState = 0,
        curNoteValue = 0,
        rolledNoteValue,
        _song = [];
    while (aleat.parts > 0) {
        for (i = 0; i < (aleat.duration * 12); i++) {
            //change note value
            rolledNoteValue = changeNoteValue();
            if (rolledNoteValue != curNoteValue) {
                curNoteValue = rolledNoteValue;
                _song.push('o/' + curNoteValue);
            }
            //add markov state to song
            _song.push(aleat.transposition[aleat.scaleRow[markovState]]);
            //change markov state
            markovState = changeMarkovState(markovState);
        }
        _song.push('|');
        aleat.parts--;
    }
    return _song;
}

function genTwelveTone() {
    var i;
}

function addTempo() {
    return 'tempo' + aleat.tempo;
}

function changeNoteValue() {
    var roll;

    roll = rand(0, aleat.noteValues.length - 1);

    return aleat.noteValues[roll];
}

function changeMarkovState(markovState) {
    var roll, i,
        range = 0;

    roll = rand(0, 100);
    for(i = 0; i < aleat.markovGrid[0].length; i++) {
        range += aleat.markovGrid[markovState][i];
        if (roll <= range) {
            return i;
        }
    }
    return i;
}

//utilities
function rand(from, to) {
    return Math.floor(Math.random()*(to-from+1)+from);
}





