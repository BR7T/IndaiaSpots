export {};
const mysql = require('mysql2');

export function newConnection() {
    let con : any = mysql.createConnection({
        host : "localhost",
        user : "root",
        password : "MyJoaol",
        database : "indaiaspots",
        multipleStatements : true
    })
    con.connect(function(err : String) {
        console.log("Connection to database Successful");
    });
    return con;
}
    

