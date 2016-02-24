

    var key = "AIzaSyC8xfLLMKcPOlgkhOd4SymGCaiHPf18tnY";
    var location = "33.80859,-118.12503";
    var radius = 1000;
    var sensor = false;
    var types = "restaurant";
    var keyword = "fast";

    var https = require('https');
    var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" + "key=" + key + "&location=" + location + "&radius=" + radius + "&name=" + "verizon"
    console.log(url);
    https.get(url, function(response) {
        var body ='';
        response.on('data', function(chunk) {
            body += chunk;
        });

        response.on('end', function() {
            var places = JSON.parse(body);


            console.log(places.results[0].vicinity);

            //res.json(randLoc);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
