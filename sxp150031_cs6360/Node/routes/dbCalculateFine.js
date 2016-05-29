


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

 exports.calc_fine = function(req, res){
    
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
          var today_date=new Date();
          console.log('connected as id ' + connection.threadId);
          var query1="select * from book_loans where loan_id='"+req.body.loan_id_fine+"';";
          connection.query(query1,function(err,rows){
          for(var i=0;i<rows.length;i++){
            if(!err && rows[i].due_date!='NULL' && rows[i].date_in!='NULL'){
              console.log("date_in ::"+rows[i].date_in);
              console.log("date_in"+getDate(rows[i].date_in));
              var days_diff=Math.round((getDate(rows[i].date_in)-getDate(rows[i].due_date))/(1000*60*60*24));
              console.log("days_diff"+days_diff);
              var fine_cal;
              if(days_diff<=0)
                fine_cal=0;
              else
               fine_cal=days_diff*0.25;
              console.log(fine_cal);
              insertUpdateFine(fine_cal,req,connection,res);
            
            }
            else if(!err && rows[i].due_date!='NULL'){

            var days_diff=Math.round((today_date-getDate(rows[i].due_date))/(1000*60*60*24));
            console.log(days_diff);
            if(days_diff<=0)
                fine_cal=0;
              else
               fine_cal=days_diff*0.25;
          
            insertUpdateFine(fine_cal,req,connection,res);

            }
          }
      });
         connection.on('error', function(err) {      
               res.json({"code" : 100, "status" : "Error in connection database"});
               return;     
         });
    });
    
 }

 
function insertUpdateFine(fine_cal,req,connection,res){
  var loan_id=parseInt(req.body.loan_id_fine);
              var query2="select * from fines where loan_id='"+req.body.loan_id_fine+"';";
              console.log(query2);
              connection.query(query2,function(err,rows){
              if(!err && !rows.length==0){
              //res.json({"code" : 101, "status" : "SSN exists in database"});
                for(var i=0;i<rows.length;i++){
                  if(rows[i].fine_amt!=fine_cal){
                    var updateRec="UPDATE fines SET fine_amt = ? WHERE paid = ? and loan_id = ?;";
                   
                    console.log(updateRec);
                    connection.query(updateRec,[rows[i].fine_amt+fine_cal,false,loan_id],function(err,rows){
                    connection.release();
                    if(!err) {
                          console.log("success2");
                          res.json({"code" : 200, "status" : "Calculate fines successfull"});
                          return;
                      //res.send(rows);
                        
                     }           
                    });
                  }
                }
             
              }
              else{
                console.log(fine_cal);
                console.log("Here");
                console.log(req.body.loan_id_fine);
                var insert_query="insert into fines SET ?;";
                
                var post={loan_id:loan_id,fine_amt:fine_cal,paid:false}; 
                console.log(post);
                var qu=connection.query('INSERT INTO fines SET ?',post,function(err,rows){
                  console.log(rows);
                //connection.release();
                if(!err) {
                    console.log("success1");
                    res.json({"code" : 200, "status" : "Calculate fines successfull"});
                    return;
                  //res.send(rows);
                    
                 }           
                });
                console.log(qu.sql);
 
              }


              });
}
 function getDate(str){
      var arr = str.split("-");
      console.log("arr[2] is:"+arr[2]);
      return new Date(arr[0], arr[1], arr[2]);
 }

