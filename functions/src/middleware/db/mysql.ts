import * as mysql from 'mysql2';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';
import { MySQLParams } from './paramsInterface';

import * as dotenv from "dotenv";
import { QueryError } from 'mysql2';
dotenv.config();

const config : MySQLParams = {
    host : process.env.MY_SQL_HOSTNAME ,
    user : process.env.MY_SQL_USER,
    database :  process.env.MY_SQL_DATABASE,
    password : process.env.MY_SQL_PASSWORD,
    multipleStatements : true
}

let con  : Connection = mysql.createConnection(config);
con.connect(function(err : QueryError | null) {
    console.log("Connection to database Successful");
});

const mySqlConnection = con; 
export {mySqlConnection};


    

