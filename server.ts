import { JsTyping, JsonObjectExpression } from "typescript";
export {};
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
// Jwt Authentication
const jwt = require('jsonwebtoken');
const jwtSecret = require('./jwtSecret.json')

//Cookie parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const fs = require('fs');
let privateKey = fs.readFileSync('PrivateKey.key', 'utf8');

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

app.use(function (req : Request, res : any, next : any) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const mySqlConnection : any = mysqlCon.newConnection();

//Page serving
function pageRoutes(routesArray : Array<any>) {
    for(let i = 0; i < routesArray.length; i++) {
        app.get(`/${routesArray[i].routeName}`, (req : Request,res : any) => {
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

app.get('/', async function(req : any,res : Response) {
    if(req.cookies.jwt6) {
        try {
            /*if(await admin.auth().verifyIdToken(req.cookies.jwt6)) {
                res.redirect('/home');
                console.log('auth succeded');
            }*/
            
        }
        catch(error) {
            console.log(error);
        }
    }
    //res.redirect('/login');
})

app.post('/userSignin', function(req : any,res : any) {
    const userData : any = {
        email : req.body.email,
        password : req.body.password
    }
 
    const homeUrl = 'http://localhost:3100/home';
    const checkEmailQuery =  'select * from user where email=?';
    mySqlConnection.query(checkEmailQuery,[userData.email], (err : string,results : Array<any>) => {
        if(err) throw err;
        if(results.length > 0) {
            bcrypt.compare(req.body.password, results[0].password, function(err : string, resp : string) {
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

async function hashPassword(password : string ,saltRounds : number) {
    const hash = await bcrypt.hash(password,saltRounds);
    return hash;
}


app.post('/checkUserExist', function(req : any,res : any) {
    const userData  = {
        username : req.body.username,
        email : req.body.email,
    }
    
    const signupCheckQuery =  'select * from user where userName=? or where email=?';
    mySqlConnection.query(signupCheckQuery,[userData.username, userData.email], (err : string,results : any) => {
        if(results.length > 0 ){ res.send({exists : true}) }
        else { res.send({exists : false}) }
    })
})

app.post('/userSignup', async function(req : any, res : any) {
    let message : unknown = null;
    let hashedPassword = await hashPassword(req.body.password,12);
    
    const userData = {
        username : req.body.username,
        email : req.body.email,
        password : hashedPassword
    }
    const signupCheckQuery =  'select * from user where userName=?; select * from user where email=?';
    const insertToDatabaseQuery = 'insert into user(userName,email,password) values (?,?,?)';

    mySqlConnection.query(signupCheckQuery,[userData.username,userData.email], (err : string,results : any) => {
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
            mySqlConnection.query(insertToDatabaseQuery,[userData.username,userData.email,userData.password], (err : string,results : any) => {
                res.send({credentials : true, errorMessage : "Cadastro Concluído"});
            });
        }
    });
})


app.get('/getEstabs', function(req : Request,res : any) {     
    const getAllRestaurants = 'select * from establishments';
    mySqlConnection.query(getAllRestaurants, (err : string, results : Array<any>) => {
        res.send(results);
    });
})

app.post('/addEstab', function(req : any,res : any) {
    const data = {
        estabName : req.body.name,
        imageUrl : req.body.imageUrl,
        description : req.body.description
    }
    const checkIfExistsQuery = 'select * from establishments where name = ? or imageUrl = ? or description = ?';
    const insertQuery = 'insert into establishments(name,imageUrl,description) values(?,?,?)';
    
    mySqlConnection.query(checkIfExistsQuery,[data.estabName,data.imageUrl,data.description], (err : string,results : any) => {
        if(results.length == 0) {
            mySqlConnection.query(insertQuery,[data.estabName,data.imageUrl,data.description], (err : string,results : any) => {
                console.log('success');
                res.send({message : "new establishment added successfully", query : true});
            })
        }
        else {
           res.send({message : "name or background image URL already in use", query : false});
        }
    })
    
})

app.post('/searchEstab', function(req :any ,res : any) {
    const searchQuery = "select * from establishments where name like CONCAT('%',?,'%')";
    const keyword = req.body.keyword;
    mySqlConnection.query(searchQuery,[keyword], (err : string,results : any) => {
        if(results.length > 0) {
            res.status(301).send(results);
        }
        else {
            res.status(404).send({error : 'nothing found'});
        }
    })
})

async function checkGoogleToken(token : string) {
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

app.post('/googleSignIn', function(req : any,res :any) {
    const homeUrl = "http://localhost:3100/home";
    const userName = req.body.username;
    const userEmail = req.body.email;
    const googleUserInfoQuery = 'insert into user(username,email,authentication_type) values(?,?,"google")';
    
    const isValidGoogleToken : any = checkGoogleToken(req.body.token).then(function() {
        if(isValidGoogleToken.error_description == "Invalid Value") {
            throw new Error('token invalid');
        }
        if(req.body.isNewUser) {
            mySqlConnection.query(googleUserInfoQuery,[userName,userEmail], (err : string,results : any) => {})
        }
        const idToken = req.body.idToken;
        const payload = {
            userId : idToken
        }
        const options = {'expiresIn' : '1h',
            algorithm: 'RS256',
            header : {
                kid: idToken
            }
        }
        let jwtToken : string = jwt.sign(payload,privateKey,options);
        /*admin.auth.createCustomToken(jwtToken).then(token => {
            res.cookie('jwt6', token, {secure : true, httpOnly : true});
            res.send({redirect : homeUrl});
        })*/
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = {hashPassword}