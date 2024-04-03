export {};
const mysql = require('mysql2');
const config = require('./mysqlConfig.json');

let con = mysql.createConnection(config);
con.connect(function(err : String) {
    console.log("Connection to database Successful");
});

let mySqlConnection = con; 
export default mySqlConnection;


    

