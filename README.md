#aleat
###An algorithmic music generator

v0.01

To see aleat in action, visit http://jtfmumm.com/aleat.

This is a very early stage of the project.  There are only a few
parameters for generation, but these will be expanded to include:

- twelve tone compositions
- a broader selection of composition styles relying on Markov chains
- more intelligent generation and development of motifs
- in-depth structure
- analysis of input midi file and generation of songs with related characteristics
- etc.

##Instructions

aleat.genSong() will generate a song based on the current settings and return a string
encoding that song.  The parameter sent to aleat.genSong() specifies the algorithm to
be used.

Currently, the string uses the musicpad notation developed by loic prot
(http://l01c.ouvaton.org/musicpad-help.html).  When this string is posted to his
musicpad script, it will be converted into a MIDI file.  His script is found at
http://l01c.ouvaton.org/cgi-bin/musicpad.cgi.

Options for generation should be sent to the aleat.options object.

A test interface for aleat is provided in aleat-test-interface.js and index.html.

###Algorithms

aleat.genMarkov: Generates a song based on a Markov matrix and a scale.

aleat.genRep: Generates a song based on repeating a single note with varying note values.

###Settings

## aleat global settings

These settings are applied to the current part during generation
aleat.tempo: the tempo of the song.

aleat.duration: the length of the song (specified in algorithmic cycles).  Will eventually be
specified in measures.

aleat.scale: the current scale and related Markov grid.  Current choices are mPenta, majPenta,
and majorFolk.

aleat.style: the playing style.  Currently changes the odds of a note taking a certain value.
Current choices are lead, bass, and crazy.

aleat.parts: the number of parts to be generated for the song.

aleat.rootTone: the root tone.  For transpositions.

aleat.instrument: the MIDI instrument specified by number.

aleat.range: the range of notes.

## aleat.options object

This object consists of an array of values for each option.  The array index corresponds to the part for which
the option will be applied.  Before a new part is added to the song, the aleat global settings are updated using
aleat.options.




