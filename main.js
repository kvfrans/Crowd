var express = require('express');
var app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(express.static('static'));


var firebase = require("firebase");
var config = {
    apiKey: "AIzaSyAkRtfQX0k6TnvuLoP22lbh_6YcuvIqNqg",
    authDomain: "crowdcontrol-f6338.firebaseapp.com",
    databaseURL: "https://crowdcontrol-f6338.firebaseio.com",
    storageBucket: "crowdcontrol-f6338.appspot.com",
};
firebase.initializeApp(config);
var db = firebase.database();
var servants_connected = 0;
db.ref("request_recieved").set(false)
db.ref("servants_connected").set(servants_connected)

app.get('/servant_connect', function (req, res) {
    servants_connected += 1;
    var ref = db.ref("servants_connected")
    ref.set(servants_connected)
    res.send(servants_connected);
});

app.post('/servant_disconnect', function (req, res) {
    servants_connected -= 1;
    var ref = db.ref("servants_connected")
    ref.set(servants_connected)
    res.send("Disonnected");
});

app.post('/client_request', function (req, res) {
    var ref = db.ref("model_structure")
    ref.set({
        hidden_size: req.body.hidden_size,
        num_layers: req.body.num_layers,
        num_inputs: req.body.num_inputs,
        num_outputs: req.body.num_outputs,
    })
    db.ref("request_recieved").set(true)

    for(var i = 0; i < servants_connected; i++)
    {
        db.ref("status"+i).set("sendToClient");
    }
    res.send("Recieved request");
});


app.get('/', function (req, res) {
    res.sendfile(__dirname + '/draw.html');
});

app.listen(8000, function () {
    console.log('Example app listening on port 8000!');
});
