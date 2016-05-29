


var mysql     =    require('mysql');
var url = require('url');

 var pool      =    mysql.createPool({
     connectionLimit : 100, //important
     host     : 'localhost',
     user     : 'root',
     password : 'niki',
     database : 'library',
     debug    :  false
 });

 exports.update_fine = function(req, res){
    
    console.log("I am here");
    /* console.log(req.body.author);
    console.log(req.body.title);
    console.log(req.body.isbn); */
   // console.log(req);

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    console.log(req.body);
    pool.getConnection(function(err,connection){
    
    if (err) {
           connection.release();
           res.json({"code" : 100, "status" : "Error in connection database"});
           return;
    }   
 
     
            // connection.release();
            
                 var query2="select bl.card_no,sum(fine_amt) as total_fine from fines f,book_loans bl where bl.loan_id=f.loan_id and bl.card_no='"+req.body.card_no_fine+"' group by bl.card_no;";
                 console.log(query2);
                 connection.query(query2,function(err,rows){
                  console.log('success selection');
                  console.log(rows);
                  res.send(rows);
                 });
                      
         
 
         connection.on('error', function(err) {      
               res.json({"code" : 100, "status" : "Error in connection database"});
               return;     
         });
    });
    
 }

 exports.pay_fine = function(req, res){
    
    console.log("I am here");
    /* console.log(req.body.author);
    console.log(req.body.title);
    console.log(req.body.isbn); */
   // console.log(req);

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    console.log(req.body);
    pool.getConnection(function(err,connection){
    
    if (err) {
           connection.release();
           res.json({"code" : 100, "status" : "Error in connection database"});
           return;
    }   
 
         console.log('connected as id ' + connection.threadId);
         var query1="select * from book_loans where loan_id='"+req.body.loan_id_pay+"';";
        
        
        console.log(query1);
         connection.query(query1,function(err,rows){
            // connection.release();
            for(var i=0;i<rows.length;i++){
              console.log("rows[i].date_in"+rows[i].date_in);
             if(!err && rows[i].date_in=='NULL') {
              res.json({"code" : 101, "status" : "Unable to pay fine for a book that has not been returned"});
              return; 
             // res.send(rows);
                
             } 
             else{
                 var query2="UPDATE fines SET fine_amt = fine_amt - ? , paid = ? WHERE loan_id=? ;";
                 console.log(query2);

                 connection.query(query2,[parseFloat(req.body.fine_amt),1,parseInt(req.body.loan_id_pay)],function(err,rows){
                 console.log('success selection');
               
                  console.log(rows);
                  res.send(rows);
                 });
             }
             }          
         });
 
         connection.on('error', function(err) {      
               res.json({"code" : 100, "status" : "Error in connection database"});
               return;     
         });
    });
    
 }

 exports.previous_fine = function(req, res){
    
    console.log("I am here");
    /* console.log(req.body.author);
    console.log(req.body.title);
    console.log(req.body.isbn); */
   // console.log(req);
  // var loan_id=parseInt(req.body.loan_id_fine);
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    console.log(req.body);
    pool.getConnection(function(err,connection){
    
    if (err) {
           connection.release();
           res.json({"code" : 100, "status" : "Error in connection database"});
           return;
    }   
 
         console.log('connected as id ' + connection.threadId);
         var query1="select * from fines f, book_loans bl where bl.loan_id=f.loan_id and paid=1 and bl.card_no='"+req.body.card_no_fine+"';";
        
        
        console.log(query1);
         connection.query(query1,function(err,rows){
            // connection.release();
            if(!err)
              res.send(rows);
         });
 
         connection.on('error', function(err) {      
               res.json({"code" : 100, "status" : "Error in connection database"});
               return;     
         });
    });
    
 }

 
 