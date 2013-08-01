//    (c) 2013 john mumm
//    <jtfmumm{at}gmail{dot}com>
//    http://github.com/jtfmumm/aleat

// Rhino file i/o utilities

var txtToArray = function(path, num) {
    //If num parameter is true, then convert txt file to numbers
    var txtFile = [];
    var tempText = '', currentLine, opener, reader;

    opener = new java.io.FileReader(path);
    reader = new java.io.BufferedReader(opener);

    while ((currentLine = reader.readLine()) != null) {
        tempText = tempText + currentLine + '\n';
    }

    txtFile = tempText.split(/\s+/);
    reader.close();

    if (num === true) {
        for (var i = 0; i < txtFile.length; i++) {
            txtFile[i] = Number(txtFile[i]);
        }
    }

    txtFile.pop();
    print(txtFile);

    return txtFile;
    //return txtFile;
};

