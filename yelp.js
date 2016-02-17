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


var iArrayCount                 = 0;
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
        .fromPath("stores/" + "la_att" + ".csv")
        .on("data", function(data){

            var objTemp = {};

            objTemp["name"]     = data[1];
            objTemp["lat"]      = data[5];
            objTemp["long"]     = data[6];

            arrayUsers.push(objTemp);
            //searchYelp(data[1], data[5], data[6]);

        })
        .on("end", function(){

            //iTotalPages =  Math.ceil(arrayUsers.length/100);

            startSearch();
        });
}



function searchYelp(name, lat, long)
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
        term: name,
        //location: "long beach",
        ll: lat + "," + long,
        radius_filter: 1000
    }).then(function (data) {

        var businesses = data.businesses;
        var objTemp1 = {};

        for (var e in businesses)
        {
            if (businesses[e].name.toLowerCase().indexOf(name.toLowerCase()) != -1)
            {

                objTemp1["url"]         = businesses[e].url;
                objTemp1["name"]        = name;
                objTemp1["lat"]         = lat;
                objTemp1["long"]        = long;

                arrayYelp.push(objTemp1);
            }
        }

        if (iArrayCount < arrayUsers.length)
        {
            startSearch();
        }
        else
        {
            console.log(arrayYelp);
        }




    }).catch(function (err) {

        objTemp1 = {};
        objTemp1["url"]      = "N/A";
        objTemp1["name"]     = name;
        objTemp1["lat"]      = lat;
        objTemp1["long"]     = long;


        arrayYelp.push(objTemp1);


        console.log(err);

        if (iArrayCount < arrayUsers.length)
        {
            startSearch();
        }
        else
        {
            console.log(arrayYelp);
        }


        if (err.type === yelp.errorTypes.areaTooLarge) {
            // ..
        } else if (err.type === yelp.errorTypes.unavailableForLocation) {
            // ..
        }
    });
}



function startSearch(){

    searchYelp(arrayUsers[iArrayCount].name,arrayUsers[iArrayCount].lat, arrayUsers[iArrayCount].long);

    console.log(iArrayCount);

    iArrayCount += 1;


}



app.use('/public', express.static(__dirname + '/public'));
app.use('/stores', express.static(__dirname + '/stores'));

app.listen(process.env.PORT || 5005);

console.log("Running at Port 5005");




//LoadCSV();





