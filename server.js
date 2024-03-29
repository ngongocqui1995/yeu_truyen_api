const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
let DDDoS = require('dddos');
const request = require('request');


// create express app
var app = express();
var cors = require('cors');
var server = require('http').Server(app);
var io = require('socket.io')(server);

module.exports = app; // for testing

// var config = {
//   appRoot: __dirname // required config
// };

// let ddos = new DDDoS({
//     checkInterval: 9000,
//     rules: [
//         // { /*Allow 4 requests accessing the application API per checkInterval*/
//         //     regexp: "^/api.*",
//         //     flags: "i",
//         //     maxWeight: 4,
//         //     queueSize: 4 /*If request limit is exceeded, new requests are added to the queue*/
//         // },
//         // { /*Only allow 1 search request per check interval.*/
//         //     string: "/action/search",
//         //     maxWeight: 1
//         // },
//         { /*Allow up to 16 other requests per check interval.*/
//             regexp: ".*",
//             maxWeight: 900,
//         }
//     ]
// });

// var i = 0
// var giayDB
// var giayKT
// var axios = require('axios')
//   setInterval(() => {
//     // ddos.request('127.0.0.1', '/', (errorCode, errorData) => {
//     //     i=i+1
//     //     if(i===1) giayDB = (new Date).getSeconds()
//     //     giayKT = (new Date).getSeconds()
//     //   console.log(`Oops, DDoS! [${errorCode}] ${errorData} ${(new Date).getSeconds()} request:${i} giaybd=${giayDB}:${giayKT}`);
//     // }, () => {
//     //     i=i+1
//     //     if(i===1) giayDB = (new Date).getSeconds()
//     //     giayKT = (new Date).getSeconds()
//     //   console.log(`The request has passed 1. request:${i} giaybd=${giayDB}:${giayKT}`);
//     // });
//     axios.get('https://tv.zing.vn/video/Hau-Due-Mat-Troi-Viet-Nam-Tap-1/IWZEO80F.html')
//     .then((result) => {
//         i=i+1
//         if(i===1) giayDB = (new Date).getSeconds()
//         giayKT = (new Date).getSeconds()
//         console.log(`thành công ${(new Date).getSeconds()} request:${i} giaybd=${giayDB}:${giayKT}`)
//     })
//     .catch((err) => {
//         console.log("lỗi")
//     })
// }, 1);  

// app.use(ddos.express());

// parse requests of content-type - application/json
app.use(bodyParser.json({limit: '50mb'}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors());


// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

require('./app/routes/stories.routes')(app);
require('./app/routes/categories.routes')(app);
require('./app/routes/userfeedback.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/dowloadImage.routes')(app);

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, { useNewUrlParser: true })
.then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});


// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to api story"});
});

server.listen(process.env.PORT || 4098, () => {
    console.log("Server is listening on port 4098");
});