
(function testRun() {
    $('#genButton').click(function() {
        populateSettings();
        submitto('generate', 'http://l01c.ouvaton.org/cgi-bin/musicpad.cgi')
    });

    function populateSettings() {
        var songSubmit;
        alea.tempo = $('#tempo').val();
        alea.duration = $('#duration').val();
        if ($('#algorithm').val() === 'markov') {
            songSubmit = genSong(genMarkov);
        } else if ($('#algorithm').val() === 'boring') {
            songSubmit = genSong(genBoring);
        } else {
            songSubmit = genSong(genMarkov);
        }
        $('#inputBox').html(songSubmit);
    }

    function submitto(action,url)
    {
        document.musicpad.btnaction.value = action;
        document.musicpad.action = url;
        document.musicpad.submit()
    }
}());