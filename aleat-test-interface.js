//  A browser interface for testing aleat.


(function testRun() {

    //
    //  SET UP PAGE
    //

    //SET UP CALLBACKS

    //Generate MIDI file
    $('#genButton').click(function() {
        populateSettings();
        submitto('generate', 'http://l01c.ouvaton.org/cgi-bin/musicpad.cgi')
    });

    //Toggle (advanced) parts menu
    $('#showAdvanced').click(function() {
        if ($('#showAdvanced').val() === 'Show Advanced') {
            $('#advanced').css('display', 'block');
            $('#showAdvanced').val('Hide Advanced');
        } else {
            $('#advanced').css('display', 'none');
            $('#showAdvanced').val('Show Advanced');
        }
    });

    //Changes to top menu repopulates parts menu
    $('#algorithm').change(function() {
        $('.algoOpts').val($('#algorithm').val());
    });

    $('#rootTone').change(function() {
        $('.rootToneOpts').val($('#rootTone').val());
    });

    $('#style').change(function() {
        $('.styleOpts').val($('#style').val());
    });

    $('#scale').change(function() {
        $('.scaleOpts').val($('#scale').val());
    });

    $('#instrument').change(function() {
        $('.instrumentOpts').val($('#instrument').val());
    });

    $('#range').change(function() {
        $('.rangeOpts').val($('#range').val());
    });

    $('#parts').change(function() {
        var count = parseInt($('#parts').val());
        $('.parts').css('display', 'none');

        for (var i = 1; i < (count + 1); i++) {
            var partNum = zeroed(i);
            $('.part' + partNum).css('display', 'block');
        }
    });

    //GENERATE PARTS MENU FROM TEMPLATES

    //Templates
    var startCode = "<li class='parts part<%= thisPart %>' id='listPart<%= thisPart %>'><label for='part<%=  thisPart %>'>Part <%= thisPart %>:</label><ul id='part<%= thisPart %>' style='list-style-type: none' class='horizontal'></ul></li>";

    var codeList = "<li><label for='<%= thisPart %><%= thisOpt %>'><%= thisLabel %>:</label><select id='<%= thisPart  %><%= thisOpt %>' class='<%= thisOpt %>Opts'></select></li>";

    //Generate parts menu
    var addParts = function() {
        var lastEl = 'advanced',
            numParts = 10;

        for (var i = 1; i < (numParts + 1); i++) {
            var newPart = document.createElement("newPart");
            var dataObject = {
                thisPart: zeroed(i),
                thisOpt: null,
                thisLabel: null
            };

            $('#' + lastEl).append(_.template(startCode, dataObject));
            lastEl = 'listPart' + dataObject.thisPart;

            for (var setting in aleat.options) {
                dataObject.thisOpt = setting;
                switch(dataObject.thisOpt) {
                    case 'rootTone':
                        dataObject.thisLabel = 'Root Tone';
                        break;
                    case 'instrument':
                        dataObject.thisLabel = 'Instrument';
                        break;
                    case 'style':
                        dataObject.thisLabel = 'Style';
                        break;
                    case 'scale':
                        dataObject.thisLabel = 'Scale';
                        break;
                    case 'range':
                        dataObject.thisLabel = 'Range';
                        break;
                }

                $('#part' + dataObject.thisPart).append(_.template(codeList, dataObject));
            }
        }
    };


    //
    // MAIN FUNCTIONS
    //

    //Send parameters to aleat object
    var populateSettings = function() {
        var songSubmit;

        aleat.reInit(); //re-initialize aleat.options

        //Populate aleat global settings
        aleat.tempo = $('#tempo').val();
        aleat.duration = $('#duration').val();
        aleat.scale = $('#scale').val();
        aleat.rootTone = $('#rootTone').val();
        aleat.style = $('#style').val();
        aleat.parts = $('#parts').val();

        //Populate options object
        for (var i = 1; i < 11; i++) {
            var partNum = zeroed(i);
            aleat.options.style.push($('#' + partNum + 'style').val());
            aleat.options.scale.push($('#' + partNum + 'scale').val());
            aleat.options.rootTone.push($('#' + partNum + 'rootTone').val());
            aleat.options.instrument.push($('#' + partNum + 'instrument').val());
            aleat.options.range.push($('#' + partNum + 'range').val());
        }

        if ($('#algorithm').val() === 'Markov') {
            songSubmit = aleat.genSong(aleat.genMarkov);
        } else if ($('#algorithm').val() === 'Repetitive') {
            songSubmit = aleat.genSong(aleat.genRep);
        } else {
            songSubmit = aleat.genSong(aleat.genMarkov);
        }

        //Write songSubmit to hidden input box for submission to MusicPad
        $('#inputBox').html(songSubmit);
    };

    //Submit hidden input box data to MusicPad
    var submitto = function(action,url) {
        document.musicpad.btnaction.value = action;
        document.musicpad.action = url;
        document.musicpad.submit()
    };

    //Populate drop-down menus
    var addOptions = function(dropName, setting) {
        var opt = document.createElement("option");
        for (var i = 0; i < dropName.length; i++) {
            for (var entry in setting) {
                opt = document.createElement("option");
                if (setting instanceof Array === true) {
                    opt.text = setting[entry];
                    opt.value = setting[entry];
                } else {
                    opt.text = setting[entry].name;
                    opt.value = entry;
                }
                dropName[i].options.add(opt);
            }
        }
    };

    //Initialize page
    var initPage = function() {
        $('.algoOpts').val($('#algorithm').val());
        $('.rootToneOpts').val($('#rootTone').val());
        $('.styleOpts').val($('#style').val());
        $('.scaleOpts').val($('#scale').val());
        $('.instrumentOpts').val($('#instrument').val());

        var count = parseInt($('#parts').val());
        $('.parts').css('display', 'none');
        $('#advanced').css('display', 'none');

        for (var i = 1; i < (count + 1); i++) {
                var partNum = zeroed(i);
                $('.part' + partNum).css('display', 'block');
        }
    };


    //
    //  UTILITIES
    //

    var zeroed = function(num) {
        if (num < 10) {
            return '0' + num;
        } else return num;
    };


    //
    //  RUN SCRIPTS
    //

    //Add parts menu to page (initially hidden)
    addParts();

    //Populate drop down menus
    var styleSel = $('.styleOpts'),
        scaleSel = $('.scaleOpts'),
        rangeSel = $('.rangeOpts'),
        algoSel = $('.algoOpts'),
        instSel = $('.instrumentOpts'),
        rootSel = $('.rootToneOpts'),
        globInstSel = $('#instrument');
        globRangeSel = $('#range');

    addOptions(globInstSel, aleat.instruments);
    addOptions(globRangeSel, aleat.ranges);
    addOptions(instSel, aleat.instruments);
    addOptions(rangeSel, aleat.ranges);
    addOptions(styleSel, aleat.styles);
    addOptions(scaleSel, aleat.scales);
    addOptions(algoSel, aleat.algos);
    addOptions(rootSel, aleat.tones);

    //Initialize page
    initPage();

}());