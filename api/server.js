"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//Express
const express = require('express');
const path = require('path');
const port = 3100;
const app = express();
//mySQL
const mysql = require('mysql2');
const mysqlCon = require('./db/mysql.js');
const getEstab = require('./establishment/getEstab.js');
//bcrypt
const hashing = require('./bcrypt/hashing.js');
// Jwt Authentication
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwtSecret.json');
//Cookie parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const fs = require('fs');
let privateKey = fs.readFileSync('privateKey.key', 'utf8');
//firebase
const firebase = require('./firebase/auth.js');
app.use(express.static(path.join('C:/VScode projects/IndaiaSpots/IndaiaSpots', 'public')));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
const mySqlConnection = mysqlCon.newConnection();
//Page serving
function pageRoutes(routesArray) {
    for (let i = 0; i < routesArray.length; i++) {
        app.get(`/${routesArray[i].routeName}`, (req, res) => {
            res.sendFile(path.join('C:/VScode projects/IndaiaSpots/IndaiaSpots', 'public', routesArray[i].fileName));
        });
    }
}
let routes = {
    pages: [
        { routeName: 'login', fileName: 'loginAndSignup.html' },
        { routeName: 'home', fileName: 'home.html' },
        { routeName: 'addEstabs', fileName: 'addEstab.html' },
        { routeName: 'emailVerification', fileName: 'emailVerification.html' }
    ]
};
pageRoutes(routes['pages']);
app.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.cookies.jwt6) {
            try {
                /*if(await admin.auth().verifyIdToken(req.cookies.jwt6)) {
                    res.redirect('/home');
                    console.log('auth succeded');
                }*/
            }
            catch (error) {
                return error;
            }
        }
        res.redirect('/login');
    });
});
app.post('/userSignin', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userData = {
            username: "",
            email: req.body.email,
            password: req.body.password
        };
        const homeUrl = 'http://localhost:3100/home';
        const checkEmailQuery = 'select * from user where email=?';
        mySqlConnection.query(checkEmailQuery, [userData.email], (err, results) => {
            if (err)
                throw err;
            if (results.length > 0) {
                let isEqual = hashing.compare(req.body.password, results[0].password);
                if (isEqual) {
                    res.send({ credentials: true, redirect: homeUrl });
                }
                else {
                    res.send({ credentials: false, errorMessage: "Email ou senha inválidos" });
                }
            }
        });
    });
});
let si = hashing.compare('sadcsdh', 'sdifnvosd');
console.log(si);
app.post('/checkUserExist', function (req, res) {
    const userData = {
        username: req.body.username,
        email: req.body.email,
        password: ""
    };
    const signupCheckQuery = 'select * from user where userName=? or where email=?';
    mySqlConnection.query(signupCheckQuery, [userData.username, userData.email], (err, results) => {
        if (results.length > 0) {
            res.send({ exists: true });
        }
        else {
            res.send({ exists: false });
        }
    });
});
app.post('/userSignup', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let message;
        let hashedPassword = yield hashing.hashPassword(req.body.password, 12);
        const userData = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        };
        const signupCheckQuery = 'select * from user where userName=?; select * from user where email=?';
        const insertToDatabaseQuery = 'insert into user(userName,email,password) values (?,?,?)';
        yield mySqlConnection.query(signupCheckQuery, [userData.username, userData.email], (err, results) => {
            if (results[0].length > 0) {
                message = "Nome de usuário já está em uso";
            }
            else if (results[1].length > 0) {
                message = "Email já está em uso";
            }
            if (message != null) {
                res.send({ errorMessage: message, credentials: false });
            }
            else if (message == null) {
                mySqlConnection.query(insertToDatabaseQuery, [userData.username, userData.email, userData.password], (err, results) => {
                    res.send({ credentials: true, errorMessage: "Cadastro Concluído" });
                });
            }
        });
    });
});
app.get('/getEstabs', function (req, res) {
    getEstab.getAllEstabs(mySqlConnection).then(results => {
        res.send(results);
    });
});
app.post('/addEstab', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = {
            estabName: req.body.name,
            imageUrl: req.body.imageUrl,
            description: req.body.description
        };
        const checkIfExistsQuery = 'select * from establishments where name = ? or imageUrl = ? or description = ?';
        const insertQuery = 'insert into establishments(name,imageUrl,description) values(?,?,?)';
        mySqlConnection.query(checkIfExistsQuery, [data.estabName, data.imageUrl, data.description], (err, results) => {
            if (results.length == 0) {
                mySqlConnection.query(insertQuery, [data.estabName, data.imageUrl, data.description], (err, results) => {
                    console.log('success');
                    res.send({ message: "new establishment added successfully", query: true });
                });
            }
            else {
                res.send({ message: "name or background image URL already in use", query: false });
            }
        });
    });
});
app.post('/searchEstab', function (req, res) {
    const searchQuery = "select * from establishments where name like CONCAT('%',?,'%')";
    const keyword = req.body.keyword;
    mySqlConnection.query(searchQuery, [keyword], (err, results) => {
        if (results.length > 0) {
            res.status(301).send(results);
        }
        else {
            res.status(404).send({ error: 'nothing found' });
        }
    });
});
app.post('/googleSignIn', function (req, res) {
    const homeUrl = "http://localhost:3100/home";
    const userName = req.body.username;
    const userEmail = req.body.email;
    const googleUserInfoQuery = 'insert into user(username,email,authentication_type) values(?,?,"google")';
    const isValidGoogleToken = firebase.checkGoogleToken(req.body.token).then(function () {
        if (isValidGoogleToken.error_description == "Invalid Value") {
            throw new Error('token invalid');
        }
        if (req.body.isNewUser) {
            mySqlConnection.query(googleUserInfoQuery, [userName, userEmail], (err, results) => { });
        }
        res.redirect('http://localhost:3100/home');
    });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
