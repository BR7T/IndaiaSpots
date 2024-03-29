//Express
const express = require('express');
import { NextFunction, Request, Response } from "express";
const path = require('path');
const port = 3100;
const app = express();
//mySQL
const mysqlCon = require('./middleware/db/mysql');
const getRestaurant = require('./restaurant/getRestaurant');
const addRestaurant = require('./restaurant/addRestaurant');
const addUser = require('./user/addUser');
const getUser = require('./user/getUser');

//bcrypt
const hashing = require('./middleware/bcrypt/hashing');

//firebase
const firebase = require('./firebase/auth');

//JWT
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwtSecret.json');
const cookieParser = require('cookie-parser');
const jwtImplementation = require('./middleware/jwt/jwtImplementation');

app.use(express.static(path.join(__dirname,'..', 'public')));
app.use(express.json());       
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(function (req : Request, res : any, next : NextFunction) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const mySqlConnection = mysqlCon.newConnection();
const domainUrl = 'http://localhost:3100';

type userData  = {
    username : string,
    email : string,
    password : string
}

type RestaurantData = {
    nome : string,
    contato : string,
    horario_atendimento : string,
    dia_atendimento : string,
    tipo_cozinha : string
}

app.get('/', async function(req : Request,res : Response) {
    if(jwtImplementation.isTokenValid(req,jwt,jwtSecret)) {
        res.redirect('/home');
    }
    else {
        jwtImplementation.refreshToken(req,res,jwt,jwtSecret);
    }
})

//User routes
app.post('/user/signin', async function(req : Request,res : Response) {
    const userData : userData = {
        username : "",
        email : req.body.email,
        password : req.body.password
    }
 
    const checkEmailQuery =  'select * from usuario where email=?';
    mySqlConnection.query(checkEmailQuery,[userData.email], (err : string,results : any) => {
        if(err) throw err;
        if(results.length > 0) {
            let isPasswordEqual = hashing.compare(req.body.password, results[0].password);
            if(isPasswordEqual) {
                res.send({process : true});
            }
            else {
                res.send({process : false});
            }
        }
    });
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

    const signupCheckQuery =  'select * from usuario where nome=?;select * from usuario where email=?';
    mySqlConnection.query(signupCheckQuery,[userData.username,userData.email], (err : string,results : Array<Array<JSON>>) => {
        if(err) {console.log(err)}
        else if(results[0].length > 0) {
            message  = "Nome de usuário já está em uso";
        }
        else if(results[1].length > 0) {
            message = 'email já está em uso';
        }
        if(message) {
            res.send({message : message, process : false});
        }
        else if(message == null) {
            addUser.addNewUser(mySqlConnection,userData);
            res.send({process : true, message : "Cadastro Concluído"});
        }
    });
});

app.post('/user/googleSignIn', function(req : Request,res :Response) {
    const userData : userData = {
        username : req.body.username,
        email : req.body.email,
        password : ""
    }

    const googleUserInsertQuery = 'insert into usuario(nome,email,tipo_autenticacao) values(?,?,"google")';
    const getUserIdQuery = 'select * from usuario where email=?';   

    const isValidGoogleToken = firebase.checkGoogleToken(req.body.token).then(function() {
        if(isValidGoogleToken.error_description == "Invalid Value") {
            throw Error(" Google Token invalid");
        }
        else if(req.body.isNewUser) {
            mySqlConnection.query(googleUserInsertQuery,[userData.username,userData.email], (err : string,results : any) => {});
        }
        else {
            mySqlConnection.query(getUserIdQuery,[userData.email], (err : string,results : any) => {
                jwtImplementation.createTokens(jwt,jwtSecret,res,results);
            })
        }
    });
})

//Establishments routes
app.get('/restaurant/getRestaurants', function(req : Request,res : Response) {     
    getRestaurant.getAllRestaurants(mySqlConnection).then(results => {
        res.send(results);
    })
})

app.get('/restaurant/getRestaurant/:id', function(req : Request,res : Response) {     
    const cookie = jwtImplementation.isTokenValid(req,jwt,jwtSecret);
    if(cookie) {
        getRestaurant.getRestaurant(mySqlConnection,req.params.id,res).then(results => {
            if(results.length == 0) {
                res.status(404).send('Not found')
            }
            else {
                res.send(results);
            }
        })
    }
})

app.post('/restaurant/addRestaurant', async function(req : Request,res : Response) {
    const cookieJwt = jwtImplementation.isTokenValid(req,jwt,jwtSecret);
    if(cookieJwt) {
        const data : RestaurantData =  {
            nome : req.body.nome,
            contato : req.body.contato,
            horario_atendimento : req.body.horario,
            dia_atendimento : req.body.diaAtendimento,
            tipo_cozinha : req.body.tipoCozinha
        }
        addRestaurant.addRestaurant(mySqlConnection,data);
    }
    else {
        res.status(400);
    }
})

app.post('/restaurant/searchRestaurant', function(req :Request ,res : Response) {
    const keyword : string = req.body.keyword;
    getRestaurant.searchRestaurant(mySqlConnection,keyword,res).then(results => {
        res.send(results);
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

