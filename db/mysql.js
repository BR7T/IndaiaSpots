const mysql = require('mysql2');

const con = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "1234",
    database : "indaiaspots",
    multipleStatements : true
});

function mySqlConnection() {
    con.connect(function(err) {
        console.log("Connection to database Successful");
    });
}

module.exports.mySqlConnection = mySqlConnection();
module.exports.con = con;
