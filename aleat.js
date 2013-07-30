
//    aleat: algorithmic music generator.
//    v0.01
//    (c) 2013 john mumm
//    <jtfmumm{at}gmail{dot}com>
//    http://github.com/jtfmumm/aleat

function test() {alert('hi');}

var aleat = {
    //aleat settings can be changed by user, but should remain unchanged during song generation
    //General settings
    tempo: 120,
    duration: 6,
    twelveTones: ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'],
    noteValues: ['4', '4', '4', '4', '4', '4', '4', '4', '8', '8', '8', '8', '16', '16', '2'],

    //Markov grid settings
    markovGrid: [
        [5, 30, 20, 20, 25], //state 0 (total 100%)
        [25, 5, 30, 20, 20], //state 1 (total 100%)
        [20, 25, 5, 30, 20], //state 2 (total 100%)
        [20, 20, 25, 5, 30], //state 3 (total 100%)
        [30, 20, 20, 25, 5]  //state 4 (total 100%)
    ],
    markovRow: [0, 3, 5, 7, 10],
    markovDuration: 12
};

function genSong(algo) {
    var song = [],
        songFinal;

    //Main routine
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

    for (i = 0; i < aleat.duration * 12; i++) {
        rolledNoteValue = changeNoteValue();
        if (rolledNoteValue != curNoteValue) {
            curNoteValue = rolledNoteValue;
            _song.push('o/' + curNoteValue);
        }
        _song.push('c');
    }

    return _song;
}

//Generates a song using a supplied Markov grid and scale (markovRow).
function genMarkov() {
    var i,
        markovState = 0,
        curNoteValue = 0,
        rolledNoteValue,
        _song = [];

    for (i = 0; i < (aleat.duration * aleat.markovDuration); i++) {
        //change note value
        rolledNoteValue = changeNoteValue();
        if (rolledNoteValue != curNoteValue) {
            curNoteValue = rolledNoteValue;
            _song.push('o/' + curNoteValue);
        }
        //add markov state to song
        _song.push(aleat.twelveTones[aleat.markovRow[markovState]]);
        //change markov state
        markovState = changeMarkovState(markovState);
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
}

//utilities
function rand(from, to) {
    return Math.floor(Math.random()*(to-from+1)+from);
}





