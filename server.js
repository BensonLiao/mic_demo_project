// include the http module
// var http = require('http');

// // create a webserver
// http.createServer(function (req, res) {

//     // respond to any incoming http request
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('Hello World\n');

// }).listen(8000, '127.0.0.1');

// // log what that we started listening on localhost:8000
// console.log('Server running at 127.0.0.1:8000');

//Using express module
var express = require('express');

var app = express();

app.use(express.static('dist')) 
app.get('/', function(req, res){
    // res.send('Hello World');
    // res.sendFile(__dirname + '/dist/index.html')
    res.sendFile(path.resolve(__dirname, 'static', 'index.html'))
});

app.listen(8000);