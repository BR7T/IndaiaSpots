"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newConnection = void 0;
const mysql = require('mysql2');
function newConnection() {
    let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "MyJoaol",
        database: "indaiaspots",
        multipleStatements: true
    });
    con.connect(function (err) {
        console.log("Connection to database Successful");
    });
    return con;
}
exports.newConnection = newConnection;
