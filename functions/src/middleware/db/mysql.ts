import * as mysql from 'mysql2';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';
import { MySQLParams } from './paramsInterface';

import * as dotenv from "dotenv";
import { QueryError } from 'mysql2';
dotenv.config();

const config : MySQLParams = {
    host :  'localhost',
    user : 'root',
    database :  'indaiaspots',
    password :  'MyJoaol',
    multipleStatements : true
}

let con  : Connection = mysql.createConnection(config);
con.connect(function(err : QueryError | null) {
    console.log("Connection to database Successful");
});

const mySqlConnection = con; 
export {mySqlConnection};


    

