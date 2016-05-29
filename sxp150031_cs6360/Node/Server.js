var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

dbConnect = require('./routes/db_connect');
dbBorrower = require('./routes/dBborrower');
dbCheckin = require('./routes/dBCheckin');
dbAddBorrower=require('./routes/dbAddBorrower');
dbFine_calc=require('./routes/dbCalculateFine');
dbFine_update=require('./routes/dbUpdateFine');
app.use(express.static('public'));
router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});
 
 
app.use("/",router);
app.post('/search/', dbConnect.handle_database);
app.post('/searchBorrower/', dbBorrower.handle_database_borrower);
app.post('/searchCheckin/', dbCheckin.handle_database_checkin);
app.post('/searchCheckinUpdateDate/', dbCheckin.handle_database_checkin_update);
app.post('/addBorrower/', dbAddBorrower.add_Borrower);
app.post('/calculateFine/', dbFine_calc.calc_fine);
app.post('/updateFine/', dbFine_update.update_fine);
app.post('/payFine/', dbFine_update.pay_fine);
app.post('/previousFine/', dbFine_update.previous_fine);
/*app.use(express.static(__dirname + '/public'));*/
/*
app.use("/css", express.static(__dirname + 'public/css'));
app.use("/js", express.static(__dirname + 'public/js'));
app.use("/img", express.static(__dirname + 'public/img'));*/

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(8081,function(){
  console.log("Live at Port 8081");
});
