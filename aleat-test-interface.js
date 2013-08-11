//  A browser interface for testing aleat.


(function testRun() {
    $('#genButton').click(function() {
        populateSettings();
        submitto('generate', 'http://l01c.ouvaton.org/cgi-bin/musicpad.cgi')
    });

    $('#algorithm').change(function() {
        if ($('#algorithm').val() === 'Repetitive') {
            //$('.scales').css('display', 'none');
            $('.algoOpts').val('Repetitive');
        }
        if ($('#algorithm').val() === 'Markov') {
            //$('.scales').css('display', 'block');
            $('.algoOpts').val('Markov');
        }
    });
    $('#rootTone').change(function() {
        var thisTone = $('#rootTone').val();
        $('.rootToneOpts').val(thisTone);
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

    $('#parts').change(function() {
        var count = parseInt($('#parts').val());
        $('.parts').css('display', 'none');
        var $partEls = $('.parts');

        for (var i = 1; i < (count + 1); i++) {
            if (i < 10) {
                var j = '0' + i;
            } else {
                j = i;
            }
            $('.part' + j).css('display', 'block');
        }
    });


    function populateSettings() {
        var songSubmit;

        aleat.reInit(); //re-initialize aleat.options
        aleat.tempo = $('#tempo').val();
        aleat.duration = $('#duration').val();
        aleat.scale = $('#scale').val();
        aleat.rootTone = $('#rootTone').val();
        aleat.style = $('#style').val();
        aleat.parts = $('#parts').val();

        //Populate options object
        for (var i = 1; i < 11; i++) {
            if (i < 10) {
                var j = '0' + i;
            } else {
                j = i;
            }
            aleat.options.style.push($('#' + j + 'style').val());
        }
         for (var i = 1; i < 11; i++) {
            if (i < 10) {
                var j = '0' + i;
            } else {
                j = i;
            }
            aleat.options.scale.push($('#' + j + 'scale').val());
        }
 /*        for (var i = 1; i < 11; i++) {
            if (i < 10) {
                var j = '0' + i;
            } else {
                j = i;
            }
            aleat.options.algo[i - 1] = $('#' + j + 'algo').val();
        }    */
         for (var i = 1; i < 11; i++) {
            if (i < 10) {
                var j = '0' + i;
            } else {
                j = i;
            }
            aleat.options.rootTone.push($('#' + j + 'rootTone').val());
        }
        for (var i = 1; i < 11; i++) {
            if (i < 10) {
                var j = '0' + i;
            } else {
                j = i;
            }
            aleat.options.instrument.push($('#' + j + 'instrument').val());
        }
        for (var i = 1; i < 11; i++) {
            if (i < 10) {
                var j = '0' + i;
            } else {
                j = i;
            }
            aleat.options.range.push($('#' + j + 'range').val());
        }

        if ($('#algorithm').val() === 'Markov') {
            songSubmit = aleat.genSong(aleat.genMarkov);
        } else if ($('#algorithm').val() === 'Repetitive') {
            songSubmit = aleat.genSong(aleat.genRep);
        } else {
            songSubmit = aleat.genSong(aleat.genMarkov);
        }
        $('#inputBox').html(songSubmit);

    }

    function submitto(action,url)
    {
        document.musicpad.btnaction.value = action;
        document.musicpad.action = url;
        document.musicpad.submit()
    }

    //////
    ////
    //

    //TEMPLATES
    var startCode = "<li class='parts part<%= thisPart %>' id='listPart<%= thisPart %>'><label for='part<%=  thisPart %>'>Part <%= thisPart %>:</label><ul id='part<%= thisPart %>' style='list-style-type: none' class='horizontal'></ul></li>";

    var codeList = "<li><label for='<%= thisPart %><%= thisOpt %>'><%= thisLabel %>:</label><select id='<%= thisPart  %><%= thisOpt %>' class='<%= thisOpt %>Opts'></select></li>";

    var addParts = function() {
        var lastEl = 'insertParts';

        for (var i = 1; i < 11; i++) {
            var newPart = document.createElement("newPart");
            var dataObject = {
                thisPart: null,
                thisOpt: null,
                thisLabel: null
            };

            if (i < 10) {dataObject.thisPart = '0' + i;} else {dataObject.thisPart = i;}

            $('#' + lastEl).after(_.template(startCode, dataObject));
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

                dataObject.thisLabel =

                $('#part' + dataObject.thisPart).append(_.template(codeList, dataObject));
            }
        }
    };


    //alert(styleSel[0].val());
    var opt = document.createElement("option");


    var addOptions = function(dropName, setting) {
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


    addParts();

    var styleSel = $('.styleOpts'),
        scaleSel = $('.scaleOpts'),
        rangeSel = $('.rangeOpts'),
        algoSel = $('.algoOpts'),
        instSel = $('.instrumentOpts'),
        rootSel = $('.rootToneOpts'),
        globInstSel = $('#instrument');

    //alert(aleat.algos instanceof Array);

    addOptions(globInstSel, aleat.instruments);
    addOptions(instSel, aleat.instruments);
    addOptions(rangeSel, aleat.ranges);
    addOptions(styleSel, aleat.styles);
    addOptions(scaleSel, aleat.scales);
    addOptions(algoSel, aleat.algos);
    addOptions(rootSel, aleat.tones);

}());