const express = require('express');
const app = express();

const logger = require('morgan'); //HTTP request logger middleware
const MongoClient = require('mongodb').MongoClient; //databases

//const logger = require('loglevel'); //logging library 

//more docs here - https://github.com/pimterry/loglevel#documentation

app.get('/', function (req, res) {
res.send('Hello World!');
});



app.listen(3000, function () {
console.log('Example app listening on port 3000!');
});
