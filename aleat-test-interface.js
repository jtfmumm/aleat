//  A browser interface for testing aleat.


(function testRun() {
    $('#genButton').click(function() {
        populateSettings();
        submitto('generate', 'http://l01c.ouvaton.org/cgi-bin/musicpad.cgi')
    });

    $('#algorithm').change(function() {
        if ($('#algorithm').val() === 'rep') {
            $('.scales').css('display', 'none');
        }
        if ($('#algorithm').val() === 'markov') {
            $('.scales').css('display', 'block');
        }
    })

    function populateSettings() {
        var songSubmit;
        aleat.tempo = $('#tempo').val();
        aleat.duration = $('#duration').val();
        aleat.scale = $('#scale').val();
        aleat.rootTone = $('#rootTone').val();
        aleat.style = $('#style').val();
        aleat.parts = $('#parts').val();
        if ($('#algorithm').val() === 'markov') {
            songSubmit = genSong(genMarkov);
        } else if ($('#algorithm').val() === 'rep') {
            songSubmit = genSong(genRep);
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