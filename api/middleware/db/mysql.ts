export {};
const mysql = require('mysql2');

module.exports = {
    newConnection() {
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
    },
    signin(connection,data) {
        const checkEmailQuery =  'select * from user where email=?';
        connection.query(checkEmailQuery,[data.email], (err : string,results : any) => {
            if(err) throw err;
            return results;
        });
    }
}
