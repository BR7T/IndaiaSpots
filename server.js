//Express
const express = require('express');
const port = 3100;
const app = express();
//mySQL
const mysql = require('mysql2');
const mysqlCon = require('./db/mysql.js');
//bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 12;

app.use(express.json());       
app.use(express.urlencoded({     
  extended: true
}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

mysqlCon.mySqlConnection;

app.post('/login', function(req,res) {
    const userLogin = {
        email : req.body.email,
        password : req.body.password
    }
    
    mysqlCon.con.query(
        `select * from user where email="${userLogin.email}";`
        , (err,results) => {
            if(err) throw err;
            if(results.length > 0) {
                if(bcrypt.compare(userLogin.password,results[0].password, (err,data) => {
                    if(err) throw err;
                    if (data) {
                        res.send({credentials : true});
                        console.log("Exists in the database");
                    }
                }))
                else if(results.length == 0){    
                    res.send({message: "Email ou senha inválidos"});
                }
            }
        });
});

app.post('/signup', async function(req,res) {
    let message = null;
    let hashedPassword = null;
    
    await bcrypt.hash(req.body.password, saltRounds).then(hash => {
            hashedPassword = hash;
    });

    const user = {
        username : req.body.username,
        email : req.body.email,
        password : hashedPassword
    }
    
    const signupCheckQuery =  `select * from user where userName="${user.username}";select * from user where email="${user.email}"`;
    const insertToDatabaseQuery = `insert into user(userName,email,password) values ("${user.username}","${user.email}","${user.password}");`
    
    mysqlCon.con.query(signupCheckQuery, (err,results) => {
        if(results[0].length > 0) {
            message  = "Nome de usuário já está em uso";
        }
        else if(results[1].length > 0) {
            message = "Email já está em uso";
        }
        if(message != null) {
                res.send({errorMessage : message});
        }
        else if(message == null) {
            mysqlCon.con.query(insertToDatabaseQuery, (err,results) => {
                res.send({credentials : true, message : "Cadastro Concluído"});
            });
        }
        });
})


app.get('/getEstabs', function(req,res) {     
    const getAllRestaurants = 'select * from establishments';
    mysqlCon.con.query(getAllRestaurants, (err, results) => {
        res.send(results);
    });
})

app.post('/addEstab', function(req,res) {
    const data = {
        estabName : req.body.name,
        imageUrl : req.body.imageUrl,
        description : req.body.description
    }
    
    const insertQuery = `insert into establishments(name,imageUrl,description) values("${data.estabName}","${data.imageUrl}","${data.description}")`;
    const checkIfExistsQuery = `select * from establishments where name = "${data.estabName}"or where imageUrl = "${data.imageUrl}"or description = "${data.description}"`;
    
    mysqlCon.con.query(insertQuery, (err,results) => {
        console.log('success');
        res.send({message : "new establishment added successfully", query : true});
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));