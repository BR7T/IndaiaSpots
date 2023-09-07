const express = require('express');
const port = 3100;
const app = express();
const mysql = require('mysql2');
const path = require('path');

app.use(express.json());       
app.use(express.urlencoded({     
  extended: true
}));

app.use(express.static(path.join(__dirname, '/public')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const con = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "1234",
    database : "IndaiaSpots",
    multipleStatements : true
});

function mySqlConnection() {
    con.connect(function(err) {
        console.log("Connection to database Successful");
    });
}

mySqlConnection();

app.post('/login', function(req,res) {
    const userLogin = {
        email : req.body.email,
        password : req.body.password
    }
    con.query(
        `select * from user where email="${userLogin.email}" and password="${userLogin.password}";`
        , (err,results) =>{
            if(err) throw err;
            if(results.length > 0) {
                console.log("Exists in the database");
                res.send({credentials : true});
            }
            else {    
                res.send({message: "Email ou senha inválidos"});
            }
        });
});


app.post('/signup', function(req,res) {
    let message = null;
    const user = {
        username : req.body.username,
        email : req.body.email,
        password : req.body.password
    }
    con.query(`select * from user where userName="${user.username}";select * from user where email="${user.email}";select * from user where password="${user.password}";`, (err,results) => {
        if(results[0].length > 0) {
            message  = "Nome de usuário já está em uso";
            inputIndex = 0;
        }
        else if(results[1].length > 0) {
            message = "Email já está em uso";
            inputIndex = 1;
        }
        else if(results[2].length > 0) {
            message = "Senha já está em uso";
            inputIndex = 2;
        }
        if(message != null) {
            res.send({errorMessage : message, inputIndex : inputIndex});
        }
        else if(message === null) {
            con.query(`insert into user(userName,email,password) values ("${user.username}","${user.email}","${user.password}");`, (err,results) => {
                res.send({credentials : true, message : "Cadastro Concluído"});
            });
        }
    })
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));