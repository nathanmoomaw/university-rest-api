var express = require('express'),
   mongoskin = require('mongoskin'),
   bodyParser = require('body-parser')

var app = express()
app.use(bodyParser())

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/../public'));

var db = mongoskin.db('mongodb://@localhost:27017/fiddle', {safe:true})

app.param('fiddles', function(req, res, next, collectionName){
  req.collection = db.collection(collectionName)
  return next()
})

//handle GET requests on /
app.get('/home', function(req, res){res.render('index.jade', {title: 'HOME'});});

app.get('/', function(req, res, next) {
  res.send('please select a collection, e.g., /collections/fiddles')
})

app.get('/collections/:fiddles', function(req, res, next) {
  req.collection.find({} ,{limit:20, sort: [['_id',-1]]}).toArray(function(e, results){
    if (e) return next(e)
    res.send(results)
  })
})

app.get('/collections/', function(req, res, next) {
  res.send('please select a collection type');
})

app.post('/collections/:fiddles', function(req, res, next) {
  req.collection.insert(req.body, {}, function(e, results){
    if (e) return next(e)
    res.send(results)
  })
})

app.get('/collections/:fiddles/:id', function(req, res, next) {
  req.collection.findById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send(result)
  })
})

app.put('/collections/:fiddles/:id', function(req, res, next) {
  req.collection.updateById(req.params.id, {$set:req.body}, {safe:true, multi:false}, function(e, result){
    if (e) return next(e)
    res.send((result===1)?{msg:'success'}:{msg:'error'})
  })
})

app.del('/collections/:fiddles/:id', function(req, res, next) {
  req.collection.removeById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send((result===1)?{msg:'success'}:{msg:'error'})
  })
})

app.listen(3000)
