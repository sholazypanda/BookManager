


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

 exports.handle_database_checkin = function(req, res){
    
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
    var query="select * from book_loans bl,borrowers br, book_copies bc where bl.isbn=bc.book_id and bl.branch_id=bc.branch_id and bl.card_no=br.card_no";
    if(req.body.book_id){
          query+=" and '"+req.body.book_id+"' LIKE CONCAT('%',bl.isbn,'%')";
    }
    if(req.body.card_no_check_in){
          query+=" and '"+req.body.card_no_check_in+"' LIKE CONCAT('%',bl.card_no,'%')";
    }
    if(req.body.borrower_name){
          query+=" and '"+req.body.borrower_name+"' LIKE CONCAT('%',br.fname,'%') or '"+req.body.borrower_name+"' LIKE CONCAT('%',br.lname,'%')";
    }
    query+=";";
    console.log(query);
    connection.query(query,function(err,rows){
        if(!err){
          console.log("success");
          console.log(rows);
          res.send(rows);
        }
        else{
          console.log(err);
        }
    });             
         
 
         connection.on('error', function(err) {      
               res.json({"code" : 100, "status" : "Error in connection database"});
               return;     
         });
    });
    
 }

 exports.handle_database_checkin_update = function(req, res){
    
     console.log("I am here");
    //console.log(req.body.author);
    /*console.log(req.body.title);
    console.log(req.body.isbn); */
   // console.log(req);
   //console.log(req.body.key);
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    console.log(req.body);
    pool.getConnection(function(err,connection){
    console.log("asdasd" + req.body.key);
    var loanids  =  req.body.key.split(",");
    var  loan_ids = "";
    var loans ="";
    var loanArr =  [] ;
    if(loanids.length  !=0) {
      for(var i = 0 ; i < loanids.length ; i++) {
          loanArr.push('$' + loanids[i]);
      }
    }  else{
      loanArr.push('$' + req.body.key);
    }
    console.log('loans::::'+loans);
    if (err) {
           connection.release();
           res.json({"code" : 100, "status" : "Error in connection database"});
           return;
    }   
    var query2="UPDATE book_loans SET date_in = ? WHERE loan_id IN (?); ";
    console.log("query2"+query2);

    //console.log(query);
    connection.query(query2,[new Date().toJSON().substring(0,10),loanArr.join(',')],function(err,rows){
        if(!err){
          console.log("success update3");
          var query3="select * from book_loans bl, book_copies bc where bc.book_id=bl.isbn and bl.branch_id=bc.branch_id and bl.loan_id in ('"+req.body.key+"');";
          console.log("query3"+query3);
          connection.query(query3,function(err,rows){
            if(!err){
              for(var i=0;i<rows.length;i++){
                  var query4="UPDATE book_copies SET no_of_copies =? WHERE book_id = ? and branch_id = ?;";
                  console.log("query4"+query4);
                  connection.query(query4,[rows[i].no_of_copies+1,rows[i].isbn,rows[i].branch_id],function(err,rows){
                  if(!err){
                    console.log("success update4");
                    res.json({"code" : 200, "status" : "Check in successfull"});
                    return;
                  }
                  });
              }
                console.log("success update3");
            }
          });
        
          //console.log(rows);
          //res.send(rows);
        }
        else{
          console.log(err);
        }
    });             
         
 
         connection.on('error', function(err) {      
               res.json({"code" : 100, "status" : "Error in connection database"});
               return;     
         });
    });
    
 }

 
 