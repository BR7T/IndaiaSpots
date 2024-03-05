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
    },
    addEstabQuery(connection,data) {
        const checkIfExistsQuery = 'select * from establishments where name = ? or imageUrl = ? or description = ?';
        const insertQuery = 'insert into establishments(name,imageUrl,description) values(?,?,?)';
    
        connection.query(checkIfExistsQuery,[data.estabName,data.imageUrl,data.description], (err : string,results : any) => {
            return results
        })
    }

}
