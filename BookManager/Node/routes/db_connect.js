


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

 exports.handle_database = function(req, res){
    
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
         var query="select * from book b, book_authors ba, authors a, book_copies bc, library_branch lb where b.isbn=ba.isbn and a.author_id=ba.author_id and bc.book_id=b.isbn and bc.branch_id=lb.branch_id";
         if(req.body.author){
          query+=" and '"+req.body.author+"' LIKE CONCAT('%',fullname,'%')";
         }
         if(req.body.isbn){
          query+=" and '"+req.body.isbn+"' LIKE CONCAT('%',b.isbn,'%')";
         }
         if(req.body.title){
          query+=" and '"+req.body.title+"' LIKE CONCAT('%',b.title,'%')";
         }
        query+=";";
        console.log(query);
         connection.query(query,function(err,rows){
             connection.release();
             if(!err) {
                
              res.send(rows);
                
             }           
         });
 
         connection.on('error', function(err) {      
               res.json({"code" : 100, "status" : "Error in connection database"});
               return;     
         });
    });
    
 }

 

 
 