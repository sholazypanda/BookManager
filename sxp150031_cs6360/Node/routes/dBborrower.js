


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

 exports.handle_database_borrower = function(req, res){
    
  
  

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
      
          var max_loan_id;

          var count_bl_bc="select  no_of_copies as NOC from book_copies  where branch_id='"+req.body.branch_id+"' and book_id ='"+req.body.isbn+"';";
          console.log(count_bl_bc);
          connection.query(count_bl_bc,function(err,rows){
          console.log("NOL"+rows[0].NOC);
         
           var noc = rows[0].NOC;
          if(rows[0].NOC==0){
           
              res.json({"code" : 303, "status" : "There is no book available in this branch for check out!"});
              return;
            
            
          } 
          else{
                var count_bl="select count(*) as loan_count from book_loans where card_no='"+req.body.card_no+"'";  
                console.log(count_bl);
                connection.query(count_bl,function(err,rows){
                console.log(rows[0].loan_count);
          if(rows[0].loan_count>3){
                console.log("inside");
                res.json({"code" : 302, "status" : "You have reached maximum limit of book loans"});
                return; 
          }
          else{
            var query1="select max(loan_id) as max_l from book_loans;";

            connection.query(query1,function(err,rows){
             //connection.release();
            if(!err) {
            console.log(rows);
            max_loan_id=parseInt(rows[0].max_l) + 1;

            var date = new Date();
            var followdate = new Date(date);

            followdate.setDate(followdate.getDate() + 14);
    
            var dd = followdate.getDate();
            var mm = followdate.getMonth() + 1;
            var y = followdate.getFullYear();

            var someFormattedDate = y + '-' + mm + '-'+ dd;
                // var query2="insert into book_loans values ("+max_loan_id+",'"+req.body.isbn+"','"+req.body.branch_id+"','"+req.body.card_no+"',DATE_FORMAT(NOW(),'%Y-%m-%d'),DATE_FORMAT(DATE_ADD(date_out,INTERVAL 14 DAY),'%Y-%m-%d'),NULL);";
            var post  = {loan_id: max_loan_id, isbn: req.body.isbn,branch_id:req.body.branch_id,card_no:req.body.card_no,date_out:new Date().toJSON().substring(0,10),due_date:someFormattedDate,date_in:'NULL'};
              connection.query('INSERT INTO book_loans SET ?', post, function(err, result) {
                connection.release();

                  if(!err) {
                      console.log("success:: ");
                      var copies = noc -1;
  
                      var updateRecord = "UPDATE book_copies SET no_of_copies = ? WHERE book_id = ? and branch_id = ?";


                      connection.query(updateRecord,[copies,req.body.isbn,req.body.branch_id], function(err, rows){

                        if(!err) {
                          console.log('decreased by 1');
                          res.json({"code" : 200, "status" : "You have successfully checked out!"});
                          return;
                          //res.send({"code" : 200, "status" : "You have successfully checked out!"});
                        }
  }                   );
                      // connection.query('UPDATE book_loans SET no_of_copies = :NCopies WHERE book_id = :bid and branch_id = :branid ,{NCopies: noc, bid: req.body.isbn , branid:req.body.branch_id });
                  // console.log()
                  }  
                  else{
                      console.log(err);
                  }         
              });
      
             }           
          });
         }
        });

          }

        });
         
 
         connection.on('error', function(err) {      
               res.json({"code" : 100, "status" : "Error in connection database"});
               return;     
         });
    });
    
 }

 

 
 