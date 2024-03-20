"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newConnection = void 0;
const mysql = require('mysql2');
const config = require('./mysqlConfig.json');
function newConnection() {
    let con = mysql.createConnection(config);
    con.connect(function (err) {
        console.log("Connection to database Successful");
    });
    return con;
}
exports.newConnection = newConnection;
