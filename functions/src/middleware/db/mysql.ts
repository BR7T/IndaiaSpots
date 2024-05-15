import * as mysql from 'mysql2';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';
import { MySQLParams } from './paramsInterface';

import * as dotenv from "dotenv";
import { QueryError } from 'mysql2';
dotenv.config();

const config : MySQLParams = {
    host :  'indaiaspotsdb.cxuugeg8q9uf.sa-east-1.rds.amazonaws.com',
    user : 'admin',
    database :  'indaiaspots',
    password :  '39r#:8jcAedyE0d$I_UP6#vBrd_O',
    multipleStatements : true
}

let con  : Connection = mysql.createConnection(config);
con.connect(function(err : QueryError | null) {
    console.log("Connection to database Successful");
});

const mySqlConnection = con; 
export {mySqlConnection};


    

