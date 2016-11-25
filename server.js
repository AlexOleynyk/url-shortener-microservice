var express = require('express');
var mongo = require("mongodb").MongoClient;

var app = express();


var url = process.env.MONGOLAB_URI;
var port = process.env.PORT || 8000;


app.set('view engine', 'jade');

app.get('/new/*', (req, res) => {

    var urlToBeShorten = req.url.slice(5);

    var myReg = /https?:\/\/*.*/gi;


    if (urlToBeShorten.match(myReg)) {

        mongo.connect(url, function(err, db) {
            if (err) {

            } else {
                console.log('hurray');
                var count = 0;
                var linksCollection = db.collection('sortenerurl');
                linksCollection.count({}, function(err, result) {
                    if (!err) {
                        count = result;

                        var urlToBeShorten = {
                            urlTo: req.url.slice(5),
                            urlFrom: count++
                        };

                        linksCollection.insert(urlToBeShorten, function(err, data) {
                            if (err) return;
                            console.log(data);
                            db.close();
                        });
                        
                        db.close();
                        res.json({
                            originalUrl: urlToBeShorten.urlTo,
                            short_url: "https://url-shortener-microservice-ao.herokuapp.com/" + urlToBeShorten.urlFrom
                        });


                    }
                });


            }
        });



    } else {
        res.json({
            error: "invalid input data. Plese, send url in format http://www.example.com or https://www.example.com"
        });
    }




});

app.get('/', function(req, res) {
    res.send('Main');
});

app.get('/*', (req, res) => {

    var urlToRedirect = req.url.slice(1);

    mongo.connect(url, function(err, db) {
        if (err) {

        } else {
            var linksCollection = db.collection('sortenerurl');

            linksCollection.find({
                urlFrom: {
                    $eq: +urlToRedirect
                }
            }).toArray(function(err, result) {
                if (!err && result.length > 0) {
                    res.redirect(result[0].urlTo);
                } else {
                    res.send("Something wrong or there no such shortened link");
                }
            });
        }
    });



    


});

app.listen(port, function() {
    console.log('Server starts on ' + port + ' port');
});
