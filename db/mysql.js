"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require('mysql2');
module.exports = {
    newConnection: function () {
        var con = mysql.createConnection({
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
    },
    signin: function (connection, data) {
        var checkEmailQuery = 'select * from user where email=?';
        connection.query(checkEmailQuery, [data.email], function (err, results) {
            if (err)
                throw err;
            return results;
        });
    },
    addEstabQuery: function (connection, data) {
        var checkIfExistsQuery = 'select * from establishments where name = ? or imageUrl = ? or description = ?';
        var insertQuery = 'insert into establishments(name,imageUrl,description) values(?,?,?)';
        connection.query(checkIfExistsQuery, [data.estabName, data.imageUrl, data.description], function (err, results) {
            return results;
        });
    }
};
