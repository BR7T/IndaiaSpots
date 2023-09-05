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
    database : "IndaiaSpots"
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
    const user = {
        username : req.body.username,
        email : req.body.email,
        password : req.body.password
    }
    con.query(`select * from user where userName="${user.username}";`, (err,results) =>{
        if(err) throw err;
        if(results.length > 0) {
            res.send({errorMessage : "Nome de usuário já está em uso"});
            return;
        }
    })
    con.query(`select * from user where email="${user.email}";`, (err,results) =>{
        if(err) throw err;
        if(results.length > 0) {
            res.send({errorMessage : "Email já está em uso"});
            return;
        }
    })
    con.query(`select * from user where password="${user.password}";`, (err,results) =>{
        if(err) throw err;
        if(results.length > 0) {
            res.send({errorMessage : "Senha já está em uso"});
            return;
        }
    })
    con.query(`insert into user(userName,email,password) values("${user.username}","${user.email}","${user.password}");`, (err,results)=>{
        if(err) throw err;
        res.send({ message: "Cadastro concluído!",credentials : true});
        return;
    })
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));