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
db.ref("model_structure").set({
    hidden_size: "20",
    num_inputs: "1",
    num_outputs: "1",
    learning_rate: ".001",
    iterations: "1000",
})
db.ref("request_recieved").set("false")
db.ref("servants_connected").set(servants_connected)res
for(var i = 0; i < 10; i++)
{
    db.ref("status"+i).set(null);
}
db.ref("weights/hiddenWeights").set(null);
db.ref("weights/outputWeights").set(null);

app.post('/servant_connect', function (req, res) {
    servants_connected += 1;
    console.log("servants changed. Total: " + servants_connected);
    var ref = db.ref("servants_connected")
    ref.set(servants_connected)
    res.send(servants_connected.toString());
});

app.post('/servant_disconnect', function (req, res) {
    servants_connected -= 1;
    console.log("servants changed. Total: " + servants_connected);
    var ref = db.ref("servants_connected")
    ref.set(servants_connected)
    res.send("Disonnected");
});

app.post('/client_request', function (req, res) {
    var ref = db.ref("model_structure")
    ref.set({
        hidden_size: req.body.hidden_size,
        num_inputs: req.body.num_inputs,
        num_outputs: req.body.num_outputs,
        learning_rate: req.body.learning_rate,
        iterations: req.body.iterations
    })
    db.ref("request_recieved").set("true")

    for(var i = 0; i < servants_connected; i++)
    {
        db.ref("status"+i).set("sendToClient");
    }
    res.send("Recieved request");
});

var hiddenWeights = [];
var outputWeights = [];
var numHiddenRecieved = 0;
var numOutputRecieved = 0;

function checkFinished()
{
    if(numHiddenRecieved == servants_connected && numOutputRecieved == servants_connected)
    {
        numHiddenRecieved = 0
        numOutputRecieved = 0
        console.log(hiddenWeights.length)
        var avgHidden = new Array(hiddenWeights[0].length+1).join('0').split('').map(parseFloat)
        var avgOutput = new Array(outputWeights[0].length+1).join('0').split('').map(parseFloat)
        for(var i = 0; i < hiddenWeights.length; i++)
        {
            for(var k = 0; k < hiddenWeights[0].length; k++)
            {
                avgHidden[k] += parseFloat(hiddenWeights[i][k])
            }
        }
        for(var i = 0; i < outputWeights.length; i++)
        {
            for(var k = 0; k < outputWeights[0].length; k++)
            {
                avgOutput[k] += parseFloat(outputWeights[i][k])
            }
        }
        for(var i = 0; i < hiddenWeights[0].length; i++)
        {
            avgHidden[i] /= servants_connected
        }
        for(var i = 0; i < outputWeights[0].length; i++)
        {
            avgOutput[i] /= servants_connected
        }
        hiddenWeights = [];
        outputWeights = [];
        db.ref("newWeights/newHiddenWeights").set(avgHidden.toString())
        db.ref("newWeights/newOutputWeights").set(avgOutput.toString())

        for(var i = 0; i < servants_connected; i++)
        {
            db.ref("status"+i).set("sendToClient");
        }
    }
}


db.ref("weights/hiddenWeights").on("value", function(snapshot) {
    if(snapshot.val() != null)
    {
        hiddenWeights.push(JSON.parse(snapshot.val()))
        numHiddenRecieved += 1
        checkFinished()
    }
}, function (errorObject) {});
db.ref("weights/outputWeights").on("value", function(snapshot) {
    if(snapshot.val() != null)
    {
        outputWeights.push(JSON.parse(snapshot.val()))
        numOutputRecieved += 1
        checkFinished()
    }
}, function (errorObject) {});

var ref = new Firebase("https://crowdcontrol-f6338.firebaseio.com");

ref.child("paymentId").on("value", onChange);

var url = "http://api.reimaginebanking.com/customers/" + snapshot.val() + "accounts?key=18287c43fec33cb6c333a33deba4b003";

var transaction = [];
transaction.push()
transaction.push({
  "id": snapshot.val(),
  "body": {
    "medium": "balance",
    "transaction_date": "2016-09-10",
    "amount": 0.01
  }
});

function onChange(snapshot) {
    http.open("POST", url, JSON.parse(JSON.stringify(transaction)));
}

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/draw.html');
});

app.listen(8000, function () {
    console.log('Example app listening on port 8000!');
});
