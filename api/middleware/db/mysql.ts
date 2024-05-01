import * as mysql from 'mysql2';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';
import { MySQLParams } from './paramsInterface';

import * as dotenv from "dotenv";
dotenv.config();

const config : MySQLParams = {
    host : process.env.MY_SQL_HOSTNAME_LOCAL,
    user : process.env.MY_SQL_USER_LOCAL,
    database : process.env.MY_SQL_DATABASE_LOCAL,
    password : process.env.MY_SQL_PASSWORD_LOCAL,
    multipleStatements : true
}

let con  : Connection = mysql.createConnection(config);
con.connect(function(err : any) {
    console.log("Connection to database Successful");
});

const mySqlConnection = con; 
export {mySqlConnection};


    

