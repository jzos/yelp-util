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
var serveIndex          = require('serve-index');
var yelp                = require("node-yelp");


var arrayUsers                  = [];
var arrayYelp                   = [];


app.use('/downloads', serveIndex(__dirname + '/downloads'));


app.get('/',function(req,res){
    res.sendFile(path.join(__dirname +'/index.html'));
    //__dirname : It will resolve to your project folder.
});


function LoadCSV()
{

    arrayUsers = [];

    csv
        .fromPath("stores/" + "verizon_la_stores" + ".csv")
        .on("data", function(data){

            var objTemp = {};

            objTemp["name"]     = data[1];
            objTemp["address"]  = data[0].split(",").join(" ") + " " + data[1] + " " + data[10];
            //objTemp["address"]  = data[2].split(",").join(" ");
            objTemp["lat"]      = data[3];
            objTemp["long"]     = data[4];

            arrayUsers.push(objTemp);

        })
        .on("end", function(){

            startSearch();
        });
}



function searchYelp(name, address, lat, long)
{

    var client = yelp.createClient({
        oauth: {
            "consumer_key": "PnQ_UsmEZLiZBFvd5KW44Q",
            "consumer_secret": "EdAYCxdW3lGbl5AEb_qp7c52pH0",
            "token": "Yz0DLIQnUeS3Bg0Qr66eT4vzUx-p_SV2",
            "token_secret": "PPquzkAQ9qnOm-D36sE_rSkOlMk"
        },

        // Optional settings:
        httpClient: {
            maxSockets: 25  // ~> Default is 10
        }
    });

    client.search({
        term: "verizon",
        location: address,
        //ll: lat + "," + long,
        radius_filter: 1000
    }).then(function (data) {

        var businesses = data.businesses;
        var objTemp1 = {};

        objTemp1["name"]        = name;
        objTemp1["address"]     = address;
        objTemp1["lat"]         = lat;
        objTemp1["long"]        = long;
        objTemp1["url"]         = "N/A";

        for (var e in businesses)
        {

            if (businesses[e].name.toLowerCase().indexOf("verizon") != -1 && businesses[e].location.address[0].indexOf(address.substr(0,5)) != -1)
            {
                console.log(businesses[e].location.address[0]);
                objTemp1["url"]         = businesses[e].url;

            }

        }


        arrayYelp.push(objTemp1);

        if ((arrayYelp.length + 1) == arrayUsers.length)
        {
            exportCSV(arrayYelp);
        }



    }).catch(function (err) {

        console.log(err);

        if (err.type === yelp.errorTypes.areaTooLarge) {
            // ..
        } else if (err.type === yelp.errorTypes.unavailableForLocation) {
            // ..
        }
    });
}



function startSearch(){

    for (var a in arrayUsers)
    {
        searchYelp(arrayUsers[a].name,arrayUsers[a].address, arrayUsers[a].lat, arrayUsers[a].long);

    }
}


function exportCSV(data){

    var csv = data;

    function json2csvCallback(err, csv) {
        if (err) throw err;

        // Save CSV File

        fs.writeFile('downloads/' + "verizon_la_stores" + '.csv', csv, function(err) {
            if (err) throw err;
            console.log('file saved');
        });

    };

    converter.json2csv(csv, json2csvCallback);

}



app.use('/public', express.static(__dirname + '/public'));
app.use('/stores', express.static(__dirname + '/stores'));

app.listen(process.env.PORT || 5005);

console.log("Running at Port 5005");




LoadCSV();





