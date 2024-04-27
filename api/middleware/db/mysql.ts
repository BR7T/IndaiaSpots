import * as mysql from 'mysql2';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';

const config = {
    host : "",
    user : "",
    database : "indaiaspots",
    password : "",
    multipleStatements : true
}

let con  : Connection = mysql.createConnection(config);
con.connect(function(err : any) {
    console.log("Connection to database Successful");
});

const mySqlConnection = con; 
export {mySqlConnection};


    

