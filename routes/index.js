var express = require('express');
var sqlite = require('sqlite3').verbose();
var sqlToJson = require('sqlite-to-json');
var fs = require("fs");
var crypto = require("crypto");
var multer = require('multer');
var upload = multer({ dest: '/tmp/'});
var file = 'auxilium.db';
var flag=0;
var exists = fs.existsSync(file);
var db = new sqlite.Database(file);
var exporter = new sqlToJson({
  client : db
})
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/contact', function(req, res) {
    res.render('contact', { title: 'Express' });
});
router.get('/promotions', function(req, res) {
    res.render('promotions', { title: 'Express' });
});
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/places', function(req, res, next) {
  res.render('places', { title: 'Express' });
});
router.get('/bnb', function(req, res, next) {
  res.render('bnb', { title: 'Express' });
});

router.get('/market', function(req, res, next) {
  res.render('market', { title: 'Express' });
});
router.get('/promotions-add',function(req, res, next){

  //var file = __dirname + '/' + req.file.filename; 

  var obj = req.query;
  console.log(obj);

  db.serialize(function(){
   
  db.run("CREATE TABLE IF NOT EXISTS promotions(ID INTEGER PRIMARY KEY AUTOINCREMENT,title char[50],owner char[50],photo char[50],email char[50],phone char[50],desc char[50])");
  var stmt = db.prepare("INSERT INTO promotions(title,owner,photo,email,phone,desc) values(?,?,?,?,?,?)");
  var title = obj.newpromotionstitle;
  var phone = obj.newpromotionsphone;
  var email = obj.newpromotionsemail;
  var desc = obj.newpromotionsdesc;
  var photo = "yo/yo";
  var owner = obj.newpromotionsowner;

  stmt.run(title,owner,photo,email,phone,desc);

  db.each("SELECT * FROM promotions", function(err, row) {
    console.log(row.title + ": " + row.phone + ":" + row.email + row.desc + ":" + row.photo + ":" + row.owner);
    });

    exporter.save("promotions","public/data/promotions.json", function(err){
     //console.log(err);
    });
    res.contentType('application/json');
    for(var j = 0; j < 100000; j++);
    return res.send({redirect: '/promotions'});
  });
  
 res.render('index', { title: 'Express' });
});
router.get('/bnb-add',function(req, res, next){

  //var file = __dirname + '/' + req.file.filename; 

  var obj = req.query;
  console.log(obj);

  db.serialize(function(){
   
  db.run("CREATE TABLE IF NOT EXISTS bnb(ID INTEGER PRIMARY KEY AUTOINCREMENT,title char[50],owner char[50],photo char[50],email char[50],phone char[50],desc char[50])");
  var stmt = db.prepare("INSERT INTO bnb(title,owner,photo,email,phone,desc) values(?,?,?,?,?,?)");
  var title = obj.newbbtitle;
  var phone = obj.newbbphone;
  var email = obj.newbbemail;
  var desc = obj.newbbdesc;
  var photo = "yo/yo";
  var owner = obj.newbbowner;

  stmt.run(title,owner,photo,email,phone,desc);

  db.each("SELECT * FROM bnb", function(err, row) {
    console.log(row.title + ": " + row.phone + ":" + row.email + row.desc + ":" + row.photo + ":" + row.owner);
    });

    exporter.save("bnb","public/data/bnb.json", function(err){
     //console.log(err);
    });
    
    res.contentType('application/json');
    return res.send({redirect: '/bnb'});
  });
  
 res.render('index', { title: 'Express' });
});


router.get('/market-add',function(req, res, next){

  //var file = __dirname + '/' + req.file.filename; 

  var obj = req.query;
  console.log(obj);

  db.serialize(function(){
   
  db.run("CREATE TABLE IF NOT EXISTS MARKET(ID INTEGER PRIMARY KEY AUTOINCREMENT,title char[50],owner char[50],photo char[50],email char[50],phone char[50],desc char[50])");
  var stmt = db.prepare("INSERT INTO MARKET(title,owner,photo,email,phone,desc) values(?,?,?,?,?,?)");
  var title = obj.newmarkettitle;
  var phone = obj.newmarketphone;
  var email = obj.newmarketemail;
  var desc = obj.newmarketdesc;
  var photo = obj.newmarketprice;
  var owner = obj.newmarketowner;

  stmt.run(title,owner,photo,email,phone,desc);

  db.each("SELECT * FROM MARKET", function(err, row) {
    console.log(row.title + ": " + row.phone + ":" + row.email + row.desc + ":" + row.photo + ":" + row.owner);
    });

    exporter.save("MARKET","public/data/MARKET.json", function(err){
     //console.log(err);
    });
    res.contentType('application/json');
    return res.send({redirect: '/market'});
  });
  
 res.render('index', { title: 'Express' });
});
router.post('/login', function(req,res,next){
    var obj = req.body;  

    flag=0;
    db.serialize(function(){
      var username=obj["lg_username"];
      var password =obj["lg_password"];

      var hashed = crypto.createHash('md5').update(password).digest('hex');
      db.each("SELECT * FROM REGISTERED", function(err, row) {
       
          if((row.username==username)&&(row.password==hashed)){
            
            console.log(row.username + ": " + hashed + ":");
            res.contentType('application/json');
            return res.send({redirect: '/market'});
          } 
      
        });
    
      });
    console.log(flag);
    
});
router.get('/register', function(req, res){

  var obj = req.query;  

  db.serialize(function(){
   
  db.run("CREATE TABLE IF NOT EXISTS REGISTERED(username char[50] primary key, password char[50], email char[50])");
  var stmt = db.prepare("INSERT INTO REGISTERED values(?,?,?)");
  var username = obj.rg_username;
  var password = obj.rg_password;
  var email = obj.rg_email;
  var hashed = crypto.createHash('md5').update(password).digest('hex');
  console.log(hashed);
  stmt.run(username, hashed, email);

  db.each("SELECT * FROM REGISTERED", function(err, row) {
    console.log(row.username + ": " + row.password + ":" + row.email);
    });
  });
});

module.exports = router;