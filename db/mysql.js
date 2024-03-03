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
        console.log(typeof con);
        con.connect(function (err) {
            console.log("Connection to database Successful");
        });
        return con;
    }
};
