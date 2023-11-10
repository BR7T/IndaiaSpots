const express = require('express');
const port = 3100;
const app = express();
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcrypt');

const saltRounds = 12;

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
    database : "indaiaspots",
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
    
    let hashedPassword = null;
    
    bcrypt.hash(req.body.password, saltRounds).then(hash => {
        hashedPassword = hash;
    }); 

    con.query(
        `select * from user where email="${userLogin.email}" and password="${hashedPassword}";`
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
    let hashedPassword = null;
    
    bcrypt.hash(req.body.name, saltRounds).then(hash => {
        hashedPassword = hash;
    });
    
    const user = {
        username : req.body.username,
        email : req.body.email,
        password : hashedPassword
    }
    
    const signupCheckQuery =  `select * from user where userName="${user.username}";select * from user where email="${user.email}";select * from user where password="${user.password}";`
    const insertToDatabaseQuery = `insert into user(userName,email,password) values ("${user.username}","${user.email}","${user.password}");`
    
    con.query(signupCheckQuery, (err,results) => {
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
            con.query(insertToDatabaseQuery, (err,results) => {
                res.send({credentials : true, message : "Cadastro Concluído"});
            });
        }
    })
});



app.get('/estab', function(req,res) {     
    const getAllRestaurants = 'select * from establishments';
    con.query(getAllRestaurants, (err, results) => {
        res.send(results);
    });
})

app.post('/addEstab', function(req,res) {
    const data = {
        estabName : req.body.name,
        imageUrl : req.body.imageUrl,
        description : req.body.description
    }
    
    const insertQuery = `insert into establishments(name,imageUrl,description) values('${data.estabName}','${data.imageUrl}','${data.description}')`;
    const checkIfExistsQuery = `select * from establishments where name = '${data.estabName}'or where imageUrl = '${data.imageUrl}'or description = '${data.description}'`;
    
    con.query(checkIfExistsQuery, (err,results) => {
        if(results[0].length > 0) {
            res.send({message : "Information already in use", query: false});
        }
        else {
            con.query(insertQuery, (err,results) => {
                console.log('success');
                res.send({message : "new establishment added successfully", query : true});
            })
        }
    })
    

})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));