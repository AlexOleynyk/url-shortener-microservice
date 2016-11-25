var express = require('express');
var app = express();

var port = process.env.PORT || 8000;

app.set('view engine', 'jade');

app.get('/', (req, res) => {
 res.send('hello');
})

app.listen(port, function() {
    console.log('Server starts on '+ port + ' port');
})