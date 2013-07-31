// From command line or cygwin, type:
//   cscript scriptname.js
// to run a JavaScript file.


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



//test = (graphToArray("graph.txt", true));
//print(test[6][4]);