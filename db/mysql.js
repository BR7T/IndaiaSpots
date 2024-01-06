const mysql = require('mysql2');

module.exports = {
    newConnection() {
        con = mysql.createConnection({
            host : "localhost",
            user : "root",
            password : "MyJoaol",
            database : "indaiaspots",
            multipleStatements : true
        })
        con.connect(function(err) {
            console.log("Connection to database Successful");
        });
        return con;
    }
}
