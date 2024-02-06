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

//firebase
const admin = require('firebase-admin');
const firebaseCredentials = require("./serviceAccountKey.json");
admin.initializeApp({
    credential : admin.credential.cert(firebaseCredentials)
})

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
        {routeName : 'addEstabs', fileName : 'addEstab.html'},
        {routeName : 'emailVerification', fileName : 'emailVerification.html'}
    ]
}
pageRoutes(routes['pages']);

app.get('/', function(req,res) {
    res.redirect('/login');
})

app.post('/userSignin', function(req,res) {
    const userData = {
        email : req.body.email,
        password : req.body.password
    }
 
    const homeUrl = 'http://localhost:3100/home';
    const checkEmailQuery =  'select * from user where email=?';
    mySqlConnection.query(checkEmailQuery,[userData.email], (err,results) => {
        if(err) throw err;
        if(results.length > 0) {
            bcrypt.compare(req.body.password, results[0].password, function(err, resp) {
                if (err){
                    console.log(err);
                }
                else if (resp) {
                    res.send({credentials : true, redirect : homeUrl});
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

app.post('/checkUserExist', function(req,res) {
    const userData = {
        username : req.body.username,
        email : req.body.email,
    }
    
    const signupCheckQuery =  'select * from user where userName=? or where email=?';
    mySqlConnection.query(signupCheckQuery,[userData.username, userData.email], (err,results) => {
        if(results.length > 0 ){ res.send({exists : true}) }
        else { res.send({exists : false}) }
    })
})

app.post('/userSignup', async function(req,res) {
    let message = null;
    let hashedPassword = await hashPassword(req.body.password,12);
    
    const userData = {
        username : req.body.username,
        email : req.body.email,
        password : hashedPassword
    }
    const signupCheckQuery =  'select * from user where userName=?; select * from user where email=?';
    const insertToDatabaseQuery = 'insert into user(userName,email,password) values (?,?,?)';

    mySqlConnection.query(signupCheckQuery,[userData.username,userData.email], (err,results) => {
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
            mySqlConnection.query(insertToDatabaseQuery,[userData.username,userData.email,userData.password], (err,results) => {
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
    const checkIfExistsQuery = 'select * from establishments where name = ? or imageUrl = ? or description = ?';
    const insertQuery = 'insert into establishments(name,imageUrl,description) values(?,?,?)';
    
    mySqlConnection.query(checkIfExistsQuery,[data.estabName,data.imageUrl,data.description], (err,results) => {
        if(results.length == 0) {
            mySqlConnection.query(insertQuery,[data.estabName,data.imageUrl,data.description], (err,results) => {
                console.log('success');
                res.send({message : "new establishment added successfully", query : true});
            })
        }
        else {
           res.send({message : "name or background image URL already in use", query : false});
        }
    })
    
})

app.post('/searchEstab', function(req,res) {
    const searchQuery = "select * from establishments where name like CONCAT('%',?,'%')";
    const keyword = req.body.keyword;
    mySqlConnection.query(searchQuery,[keyword], (err,results) => {
        if(results.length > 0) {
            res.status(301).send(results);
        }
        else {
            res.status(404).send({error : 'nothing found'});
        }
    })
})

async function checkGoogleToken(token) {
    await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`, {   
        method : 'GET',
        mode: 'cors',
        cache: 'default',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(response => response.json()).then(response => {
        return response;
    })
}

app.post('/googleSignIn', function(req,res) {
    const homeUrl = "http://localhost:3100/home";
    const userName = req.body.username;
    const userEmail = req.body.email;
    const googleUserInfoQuery = 'insert into user(username,email,authentication_type) values(?,?,"google")';
    
    const isValidGoogleToken = checkGoogleToken(req.body.token).then(function() {
        if(isValidGoogleToken.error_description == "Invalid Value") {
            throw new Error('token invalid');
        }
        else {
            if(req.body.isNewUser) {
                mySqlConnection.query(googleUserInfoQuery,[userName,userEmail], (err,results) => {})
            }
            res.send({redirect : homeUrl});
        }
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

