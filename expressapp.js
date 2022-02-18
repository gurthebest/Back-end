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
app.use(
    function
        (
            req, res, next
        )
    {
// allow different IP address
        res.header(
            "Access-Control-Allow-Origin"
            ,
            "*"
        );
// allow different header fields
        res.header(
            "Access-Control-Allow-Headers"
            ,
            "*"
        ); next(); });
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
app.get("/Search/:collectionName/*", function(req, res) {
    console.log("Performed a search query")
    
    var queries = url.parse(req.url, true).query;

    var searchTerm = queries['search'];

    if (searchTerm) {
        console.log(searchTerm)
       

      if (!isNaN(searchTerm)){

          req.collection.find(
              { "id":  parseInt(searchTerm)}
          )
              .toArray((e, results) => {
                  if (e) return next(e)
                  res.send(results)
              })
      } else {
          console.log("number is NOT integer")
          var regexx = new RegExp('^' + searchTerm );

          req.collection.find({ $or: [
                  { "subject": { $regex: regexx}},
                  { "location": { $regex: regexx }}
              ]})
              .toArray((e, results) => {
                  
                  if (e) return next(e)
                  res.send(results)
              })
      }



    }

});

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
    req.collection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body },
        { safe: true, multi: false },
        (e, result) => {
            if (e) return next(e)
            res.send((result.update === 1) ?
                { msg: 'error' } : { msg: 'success' })
        })
})
app.put('/update/:collectionName/:id', (req, res, next) => {
    console.log("PUT REQUEST")
    req.collection.update({
        id  : parseInt(req.params.id)
}, {
    $set: req.body
}, {
    safe: true,
    multi: false
}, (e, result) => {
    console.log(result)
    if (e) {

        return next(e)
    }
    res.send((result.matchedCount === 1) ? {
        msg: 'success'
    } : {
        msg: 'error'
    })
})
})
   var publicPath = path.resolve(__dirname,  "images");
   app.use(express.static(publicPath));
   app.use(function(request, response) {
       response.writeHead(404, {
           "Content-Type": "text/plain"
       });
       response.end("Picture Not Found.");
   });
        

const port = process.env.PORT ||3000
app.listen(port, function () {
    console.log("App started on port "+port);
})
