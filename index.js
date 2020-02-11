var MongoClient = require('mongodb');
var url = "mongodb://localhost:27017/";
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
var mode = 'message';

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db('ASCmorse');
    console.log('Database <<ASCmorse>> created.');
    dbo.createCollection('Normal', function (err, res) {
        if (err) throw err;
        console.log('Collection <<Normal>> created.');
        dbo.createCollection('Play', function (err, res) {
            if (err) throw err;
            console.log('Collection <<Play>> created.');
            dbo.createCollection('Recieved', function (err, res) {
                if (err) throw err;
                console.log('Collection <<Recieved>> created.')
                dbo.createCollection('CurrentNormal', function (err, res) {
                    if (err) throw err;
                    console.log('Collection <<CurrentNormal>> created.');
                    dbo.createCollection('CurrentPlay', function (err, res) {
                        if (err) throw err;
                        console.log('Collection <<CurrentPlay>> created.');
                        db.close();
                    });
                });
            });
        });
    });
});

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/mode', function (req, res) {
    res.status(200).send({ content: mode });
    console.log('Arduino mode sended.');
});

app.get('/normal', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db('ASCmorse');
        dbo.collection('Normal').find({}).toArray(function (err, result) {
            if (err) throw err;
            db.close()
            res.status(200).send(result);
            console.log('Data of <<Normal>> collection sended.');
        });
    });
});

app.get('/play', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db('ASCmorse');
        dbo.collection('Play').find({}).toArray(function (err, result) {
            if (err) throw err;
            db.close()
            res.status(200).send(result);
            console.log('Data of <<Play>> collection sended.');
        });
    });
});

app.get('/recieved', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db('ASCmorse');
        dbo.collection('Recieved').find({}).toArray(function (err, result) {
            if (err) throw err;
            db.close()
            res.status(200).send(result);
            console.log('Data of <<Recieved>> collection sended.');
        });
    });
});

app.get('/currentnormal', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db('ASCmorse');
        dbo.collection('CurrentNormal').findOne({}, function (err, result) {
            if (err) throw err;
            db.close();
            res.status(200).send(result);
            console.log('First of <<CurrentNormal>> collection sended.');
        });
    });
});

app.get('/currentplay', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db('ASCmorse');
        dbo.collection('CurrentPlay').findOne({}, function (err, result) {
            if (err) throw err;
            db.close();
            res.status(200).send(result);
            console.log('First of <<CurrentPlay>> collection sended.');
        });
    })
});

app.post('/mode', function (req, res) {
    mode = req.body.content;
    res.send({ operation: 'OK' });
    console.log('Arduino mode updated.');
});

app.post('/normal', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db('ASCmorse');
        var newNormal = { date: req.body.date, content: req.body.content };
        dbo.collection('Normal').insertOne(newNormal, function (err, result) {
            if (err) throw err;
            console.log('Document inserted on <<Normal>> collection.');
            dbo.collection('CurrentNormal').insertOne(newNormal, function (err, result) {
                if (err) throw err;
                console.log('Document inserted on <<CurrentNormal>> collection.');
                db.close();
                res.status(201).send({ operation: 'OK' });
            });
        });
    });
});

app.post('/play', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db('ASCmorse');
        var newPlay = { date: req.body.date, content: req.body.content };
        dbo.collection('Play').insertOne(newPlay, function (err, result) {
            if (err) throw err;
            console.log('Document inserted on <<Play>> collection.');
            dbo.collection('CurrentPlay').insertOne(newPlay, function (err, result) {
                if (err) throw err;
                console.log('Document inserted on <<CurrentPlay>> collection.');
                db.close();
                res.status(201).send({ operation: 'OK' });
            });
        });
    });
});

app.post('/recieved', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db('ASCmorse');
        var newRecieved = { date: req.body.date, content: req.body.content };
        dbo.collection('Recieved').insertOne(newRecieved, function (err, result) {
            if (err) throw err;
            console.log('Document inserted on <<Recieved>> collection.');
            db.close();
            res.status(201).send({ operation: 'OK' });
        });
    });
});

app.delete('/normal', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db('ASCmorse');
        dbo.collection('Normal').findOne({}, function (err, result) {
            if (err) throw err;
            if (result) {
                var myQuery = { _id: result._id };
                dbo.collection('CurrentNormal').deleteOne(myQuery, function (err, obj) {
                    if (err) throw err;
                    console.log('Document of <<CurrentNormal>> eliminated.');
                });
            }
            else {
                db.close();
            }
        });
    });
});

app.delete('/play', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db('ASCmorse');
        dbo.collection('Play').findOne({}, function (err, result) {
            if (err) throw err;
            if (result) {
                var myQuery = { _id: result._id };
                dbo.collection('CurrentPlay').deleteOne(myQuery, function (err, obj) {
                    if (err) throw err;
                    console.log('Document of <<CurrentPlay>> eliminated.');
                });
            }
            else {
                db.close();
            }
        });
    });
});

app.listen(3000, () => {
    console.log('\nServer started on <<localhost:3000>>.');
});