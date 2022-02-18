const express = require('express')
const app = express()

var path = require("path");
var fs = require("fs");
const { ObjectId } = require('mongodb');

app.use(express.json())
   


const MongoClient = require('mongodb').MongoClient;




let db
MongoClient.connect('mongodb+srv://User2022:17102000Gur@cluster0.q3gsm.mongodb.net/testing', (err, client) => {
    db = client.db('testing')
})
app.use(function (req, res, next) {
    console.log("Request IP: " + req.url);
    console.log("Request date: " + new Date());
    next(); // this should stop the browser from hanging
});
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    return next()
})


app.get('/', (req, res, next) => {
    res.send('Select a collection, e.g., /collection/messages')
})


app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({},)
        .toArray((e, results) => {
            if (e) return next(e)
            res.send(results)
        }
        )
})

const ObjectID = require('mongodb').ObjectId;

app.get('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.findOne(
        { id: new ObjectID(req.params.id) },
        (e, result) => {
            if (e) return next(e)
            res.send(result)
        })
})



app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next(e)
        res.send(results.ops)
    })
})
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body },
        { safe: true, multi: false },
        (e, result) => {
            if (e) return next(e)
            res.send((result.update === 1) ?
                { msg: 'error' } : { msg: 'success' })
        })
})
app.use(function (req, res, next) {
    // Uses path.join to find the path where the file should be
    var filePath = path.join(__dirname, "images", req.url);
    // Built-in fs.stat gets info about a file
    fs.stat(filePath, function (err, fileInfo) {
       
        if (err) {
           if (err.code === 'ENOENT') {
                res.statusCode = 404;
            res.end('File not found')
           }
           
            next();
            return;
        } 
        if (fileInfo.isFile()) res.sendFile(filePath);
        else next();
    });
});
app.listen(3000, function () {
    console.log("App started on port 3000");
});