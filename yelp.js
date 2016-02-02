/**
 * Created by jaimemac on 1/20/16.
 */


/****
 *
  * Todo : Rewrite the code using sails.js in MVC
 */


var express             = require('express');
var app                 = express();
var path                = require("path");
var jsonexport          = require('jsonexport');
var fs                  = require('fs');
var converter           = require('json-2-csv');
var csv                 = require("fast-csv");
var Twitter             = require('twitter');
var serveIndex          = require('serve-index');


var sFileName                   = "";
var iCheckTwitterData;
var csvFile;
var arrayUsers                  = [];
var arrayImages                 = [];
var arrayUsersData              = [];
var arrayUserTwitterData        = [];
var iPageNo;
var iTotalPages;
var objTwitterData              = null;




app.use('/downloads', serveIndex(__dirname + '/downloads'));



app.get('/',function(req,res){
    res.sendFile(path.join(__dirname +'/index.html'));
    //__dirname : It will resolve to your project folder.
});



app.post('/exportCSV', function (req, res) {

    var body = '';

    req.on('data', function(chunk) {
        body += chunk;
    });

    req.on('end', function() {
        var csv = JSON.parse(body);

        var sCSVFilename = csv[0]["Company Name"];

        sCSVFilename = sCSVFilename.replace(/['|\s]/g,"");

        console.log("File Name : " + sCSVFilename);

        function json2csvCallback(err, csv) {
            if (err) throw err;

            // Save CSV File

            fs.writeFile('downloads/' + sCSVFilename + '.csv', csv, function(err) {
                if (err) throw err;
                console.log('file saved');
                res.send("File Saved");
            });

        };

        converter.json2csv(csv, json2csvCallback);

    });

});





app.use('/public', express.static(__dirname + '/public'));
app.use('/downloads', express.static(__dirname + '/downloads'));

app.listen(process.env.PORT || 5005);

console.log("Running at Port 5005");

