export {};
const mysql = require('mysql2');
const config = require('./mysqlConfig.json');

export function newConnection() {
    let con : any = mysql.createConnection(config);
    con.connect(function(err : String) {
        console.log("Connection to database Successful");
    });
    return con;
}
    

