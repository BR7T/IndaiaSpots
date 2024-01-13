//Express
const express = require('express');
const path = require('path');
const port = 3100;
const app = express();
//mySQL
const mysql = require('mysql2');
const mysqlCon = require('./db/mysql.js');
//bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 12;

app.use(express.static(path.join(__dirname, 'public')));
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

mySqlConnection = mysqlCon.newConnection();

//Page serving
function pageRoutes(routesArray) {
    for(let i = 0; i < routesArray.length; i++) {
        app.get(`/${routesArray[i].routeName}`, (req,res) => {
            res.sendFile(path.join(__dirname, 'public', routesArray[i].fileName));
        })
    }
}

let routes = {
    pages : [
        {routeName : 'login', fileName : 'loginAndSignup.html'},
        {routeName : 'home', fileName : 'home.html'},
        {routeName : 'addEstabs', fileName : 'addEstab.html'}
    ]
}
pageRoutes(routes['pages']);


app.post('/loginUser', function(req,res) {
    const userLogin = {
        email : req.body.email,
        password : req.body.password
    }
 
    mySqlConnection.query(
        `select * from user where email="${userLogin.email}";`, (err,results) => {
            if(err) throw err;
            if(results.length > 0) {
                bcrypt.compare(req.body.password, results[0].password, function(err, resp) {
                    if (err){
                      console.log(err);
                    }
                    else if (resp) {
                      res.send({credentials : true});
                    } else {
                        res.send({credentials : false,errorMessage: "Email ou senha inválidos"});
                    }
                });
            }
            else {
                res.send({credentials : false,errorMessage: "Email ou senha inválidos"});
            }
    });
    
});

async function hashPassword(password,saltRounds) {
    const hash = await bcrypt.hash(password,saltRounds);
    return hash;
}

app.post('/signup', async function(req,res) {
    let message = null;
    let hashedPassword = await hashPassword(req.body.password,saltRounds);
    
    const user = {
        username : req.body.username,
        email : req.body.email,
        password : hashedPassword
    }
    
    const signupCheckQuery =  `select * from user where userName="${user.username}";select * from user where email="${user.email}"`;
    const insertToDatabaseQuery = `insert into user(userName,email,password) values ("${user.username}","${user.email}","${user.password}");`
    
    mySqlConnection.query(signupCheckQuery, (err,results) => {
        if(results[0].length > 0) {
            message  = "Nome de usuário já está em uso";
        }
        else if(results[1].length > 0) {
            message = "Email já está em uso";
        }
        if(message != null) {
            res.send({errorMessage : message, credentials : false});
        }
        else if(message == null) {
            mySqlConnection.query(insertToDatabaseQuery, (err,results) => {
                res.send({credentials : true, errorMessage : "Cadastro Concluído"});
            });
        }
    });
})


app.get('/getEstabs', function(req,res) {     
    const getAllRestaurants = 'select * from establishments';
    mySqlConnection.query(getAllRestaurants, (err, results) => {
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
    
    mySqlConnection.query(insertQuery, (err,results) => {
        console.log('success');
        res.send({message : "new establishment added successfully", query : true});
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));