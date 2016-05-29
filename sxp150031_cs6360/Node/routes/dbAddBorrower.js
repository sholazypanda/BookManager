


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

 exports.add_Borrower = function(req, res){
    
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
        var query1="select max(card_no) as max_card_no from borrowers;";
        console.log(query1);
        connection.query(query1,function(err,rows){
        console.log("success1 ");
        console.log('connected as id ' + connection.threadId);
        console.log(rows[0].max_card_no);

        var card_no = rows[0].max_card_no;
        var max_card_no=card_no.substring(0,4) + (parseInt(card_no.substring(4,card_no.length)) + 1);
        console.log("pp" +  max_card_no);
        var query2="select * from borrowers where ssn='"+req.body.ssn+"'; ";
        console.log(query2);
        connection.query(query2,function(err,rows){
          if(!err && rows.length!=0){
            res.json({"code" : 101, "status" : "SSN exists in database"});
            return ;
          }
        else{
        var query="insert into borrowers set ?";
       
         var post={card_no:max_card_no,ssn:req.body.ssn,fname:req.body.fname,lname:req.body.lname,email:req.body.email,address:req.body.address,city:req.body.city,state:req.body.state,phone:req.body.phone};
        //var post={card_no:'ID',ssn:req.body.ssn};
        console.log(query);
        connection.query('insert into borrowers SET ?',post,function(err,rows){
        connection.release();
        console.log(rows);
             if(!err) {
                console.log("success 2");
              res.send(rows);
              
                
             } else {
                console.log(err);
             }

        }); 
        }         
        });
        });
         connection.on('error', function(err) {      
               res.json({"code" : 100, "status" : "Error in connection database"});
               return;     
         });
    });
    
 }

 

 
 