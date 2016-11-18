var express = require('express');
var sqlite = require('sqlite3').verbose();
var sqlToJson = require('sqlite-to-json');
var fs = require("fs");
var crypto = require("crypto");
var file = 'auxilium.db';
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

router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/market', function(req, res, next) {
  res.render('market', { title: 'Express' });
});

router.get('/register', function(req, res){

  db.serialize(function(){
   
  db.run("CREATE TABLE IF NOT EXISTS REGISTERED(username char[50], password char[50], email char[50])");
  var stmt = db.prepare("INSERT INTO REGISTERED values(?,?,?)");
  var username = "Ishan"
  var password = "qwerty"
  var email = "mail@mail.com"
  var hashed = crypto.createHash('md5').update(password).digest('hex');

  stmt.run(username, hashed, email);

  //alert("Registered!");

  db.each("SELECT * FROM REGISTERED", function(err, row) {
    console.log(row.username + ": " + row.password + ":" + row.email);
    });
  });
})

module.exports = router;
