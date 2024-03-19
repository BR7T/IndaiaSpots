//Express
const express = require('express');
import { NextFunction, Request, Response } from "express";
const path = require('path');
const port = 3100;
const app = express();
//mySQL
const mysqlCon = require('./middleware/db/mysql.js');
const getEstab = require('./establishment/getEstab.js');
const addEstab = require('./establishment/addEstab.js');
const addUser = require('./user/addUser.js');
const getUser = require('./user/getUser.js');

//bcrypt
const hashing = require('./middleware/bcrypt/hashing.js');

//firebase
const firebase = require('./firebase/auth.js');

//JWT
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwtSecret.json');
const cookieParser = require('cookie-parser');
const verifyJWt = require('./middleware/jwt/verifyJwt.js');


app.use(express.static(path.join(__dirname,'..', 'public')));
app.use(express.json());       
app.use(express.urlencoded({     
  extended: true
}));
app.use(cookieParser());

app.use(function (req : Request, res : any, next : NextFunction) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const mySqlConnection = mysqlCon.newConnection();
const domainUrl = 'http://localhost:3100';

//Page serving
function pageRoutes(routesArray : Array<any>) {
    for(let i = 0; i < routesArray.length; i++) {
        app.get(`/${routesArray[i].routeName}`, (req : Request,res : Response) => {
            res.sendFile(path.join( __dirname,'..', 'public', routesArray[i].fileName));
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

type userData  = {
    username : string,
    email : string,
    password : string
}

type estabData = {
    estabName : string,
    imageUrl : string,
    description : string
}

app.get('/', async function(req : Request,res : Response) {
    const token = req.cookies.authorization1;
    const decoded = jwt.verify(token, jwtSecret.key);
    mySqlConnection.query('select * from user where id_user=?',[decoded.userId], (err,results) => {
        if(results.length > 0) {
            res.redirect('/home');
        }
        else if(results.length == 0) {
            //res.redirect('/login');
        }
    })
})

//User routes
app.post('/user/signin', async function(req : Request,res : Response) {
    const userData : userData = {
        username : "",
        email : req.body.email,
        password : req.body.password
    }
 
    const homeUrl = `${domainUrl}/home`;
    const checkEmailQuery =  'select * from user where email=?';
    mySqlConnection.query(checkEmailQuery,[userData.email], (err : string,results : any) => {
        if(err) throw err;
        if(results.length > 0) {
            let isEqual = hashing.compare(req.body.password, results[0].password);
            if(isEqual) {
                res.send({credentials : true, redirect : homeUrl});
            }
            else {
                res.send({credentials : false,errorMessage: "Email ou senha inválidos"});
            }
        }
    });
})

app.post('/user/checkUserExist', function(req : Request,res : Response) {
    const userData : userData = {
        username : req.body.username,
        email : req.body.email,
        password : ""
    }
    
    getUser.checkIfUserExists(mySqlConnection,userData).then(result => {
        if(result) res.send({exists : true})
        else {
            res.send({exists : false})
        }
    })
})

app.post('/user/signup', async function(req : Request, res : Response) {
    if(req.body.password.length < 8 ) {
        res.status(400);
    }
    
    let message : string | null = null;
    let hashedPassword : string = await hashing.hashPassword(req.body.password,12);
    
    const userData : userData = {
        username : req.body.username,
        email : req.body.email,
        password : hashedPassword
    }

    const signupCheckQuery =  'select * from user where userName=? or email=?;select * from user where email=?';
    mySqlConnection.query(signupCheckQuery,[userData.username,userData.email], (err : string,results : Array<Array<JSON>>) => {
        if(err) {console.log(err)}
        else if(results[0].length > 0) {
            message  = "Nome de usuário já está em uso";
        }
        else if(results[1].length > 0) {
            message = 'email já está em uso';
        }
        if(message) {
            res.send({errorMessage : message, credentials : false});
        }
        else if(message == null) {
            addUser.addNewUser(mySqlConnection,userData);
            res.send({credentials : true, errorMessage : "Cadastro Concluído"});
        }
    });
});

app.post('/user/googleSignIn', function(req : Request,res :Response) {
    const userData : userData = {
        username : req.body.username,
        email : req.body.email,
        password : ""
    }

    const googleUserInsertQuery = 'insert into user(username,email,authentication_type) values(?,?,"google")';
    const getUserIdQuery = 'select * from user where email=?';   
    const isValidGoogleToken = firebase.checkGoogleToken(req.body.token).then(function() {
        if(isValidGoogleToken.error_description == "Invalid Value") {
            throw Error('token invalid');
        }
        else if(req.body.isNewUser) {
            mySqlConnection.query(googleUserInsertQuery,[userData.username,userData.email], (err : string,results : any) => {});
        }
        mySqlConnection.query(googleUserInsertQuery,[userData.username,userData.email], (err : string,results : any) => {});
        mySqlConnection.query(getUserIdQuery,[userData.email], (err : string,results : any) => {
            const token = jwt.sign({userId : results[0].id_user},jwtSecret.key, {'expiresIn' : '1h'});
            res.cookie('authorization1',token, {secure : true, httpOnly : true}).send({n : 'n'});
        });
    })
})

//Establishments routes
app.get('/estab/getEstabs', function(req : Request,res : Response) {     
    const decoded = verifyJWt.verify(req,jwt,jwtSecret);
    if(decoded) {
        getEstab.getAllEstabs(mySqlConnection).then(results => {
            res.send(results);
        })
    } else {
        res.status(400);
    }
})

app.get('/estab/getEstab/:id', function(req : Request,res : Response) {     
    const decoded = verifyJWt.verify(req,jwt,jwtSecret);
    if(decoded) {
        getEstab.getEstab(mySqlConnection,req.params.id,res).then(results => {
            if(results.length == 0) {
                res.status(404).send('Not found')
            }
            else {
                res.send(results);
            }
        })
    }
})

app.post('/estab/addEstab', async function(req : Request,res : Response) {
    const data : estabData =  {
        estabName : req.body.name,
        imageUrl : req.body.imageUrl,
        description : req.body.description
    }
    addEstab.addEstab(mySqlConnection,data);
})

app.post('/estab/searchEstab', function(req :Request ,res : Response) {
    const keyword : string = req.body.keyword;
    getEstab.searchEstab(mySqlConnection,keyword,res).then(results => {
        res.send(results);
    })
})

app.post('/refreshToken', function(req : Request, res : Response) {
    const refreshToken = jwt.sign({})
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

