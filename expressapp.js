var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require('body-parser');
var url = require("url");
var path = require("path");

app.use(bodyParser());
app.use(cors())

    const MongoClient = require('mongodb').MongoClient;
    let db;
    MongoClient.connect('mongodb+srv://User2022:17102000Gur@cluster0.q3gsm.mongodb.net/testing', (err, client) => {
        db = client.db('testing')

    })

    //Allow CORS
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

            // the 'logger' middleware
            app.use(function(req, res, next) {
                console.log("Request URL: " + req.url);
                console.log("Request IP Address: " +  req.ip);
                console.log("Request date: " + new Date());
                next();
            });


        app.param('collectionName', (req, res, next, collectionName) => {
            req.collection = db.collection(collectionName)
          //  console.log(req.collection)
            return next()
        })


        app.get('/collection/:collectionName', (req, res, next) => {
            req.collection.find({}, {
               // limit: 15,
                sort: [
                    ['price', -1]
                ]
            }).toArray((e, results) => {
                if (e) return next(e)
                res.send(results)
            })
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


        app.post('/collection/:collectionName', (req, res, next) => {
          
            console.log("Received POST Request")

            req.collection.insert(req.body, (e, results) => {
                if (e) {
                    return next(e)
                }
               
            })
    })

    const ObjectID = require('mongodb').ObjectID;
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

        // Sets up the path where your static files are
        var publicPath = path.resolve(__dirname,  "assets");
        // Sends static files from the publicPath directory
        app.use(express.static(publicPath));
        app.use(function(request, response) {
            response.writeHead(404, {
                "Content-Type": "text/plain"
            });
            response.end("Picture Not Found.");
        });



    const port = process.env.PORT || 3000;
    app.listen(port,function (){

        console.log("App started on port " + port);
    })
