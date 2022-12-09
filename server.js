//Jesse Pirrotta
//Student Number: 169115219
//BTI325 - Test 4
//Date: 2022-12-09
//Cyclic URL: https://busy-pear-cygnet-tie.cyclic.app/

const express = require('express');
const app = express();
const HTTP_PORT = process.env.PORT || 8080; //Means to use the environment port, if its not set, use 8080
const final = require("./final.js");
const path = require('path');
app.use(express.urlencoded({extended: true}));

//call startDB then listen on port 8080
final.startDB()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log("Server listening on: " + HTTP_PORT);
        });
    });

//Home Route
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/views/home.html'));
});

//Register GET route
app.get('/register', function (req, res) {
    res.sendFile(path.join(__dirname, '/views/register.html'));
});

//Register POST Route
app.post('/register', function (req, res) {
    final.register(req.body).then(() => {
        res.send(req.body.email + "registered successfully" + "<br><br><a href='/'>Home</a>");
    }).catch((err) => {
        res.send(err + "<br><a href='/register'>Try Again</a>");
    });
});

//Login route
app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/views/signIn.html');
});

//Post Login
app.post('/login', function (req, res) {
    final.signIn(req.body).then(() => {
        res.send(req.body.email + " signed in successfully" + "<br><br><a href='/'>Go Home</a>");
    }).catch((err) => {
        res.send(err + "<br><a href='/login'>Try Again</a>");
    });
});


//Error 404
app.use((req, res) => {
    console.log("404 Error:" + req.url);
    res.status(404).send("Error 404: Page Not Found");
});





