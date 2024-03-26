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
const mysqlCon = require('./middleware/db/mysql.js');
const getRestaurant = require('./restaurant/getRestaurant.js');
const addRestaurant = require('./restaurant/addRestaurant.js');
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
const jwtValidation = require('./middleware/jwt/jwtValidation.js');
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
const mySqlConnection = mysqlCon.newConnection();
const domainUrl = 'http://localhost:3100';
//Page serving
function pageRoutes(routesArray) {
    for (let i = 0; i < routesArray.length; i++) {
        app.get(`/${routesArray[i].routeName}`, (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'public', routesArray[i].fileName));
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
        if (jwtValidation.isTokenValid(req, jwt, jwtSecret)) {
            res.redirect('/home');
        }
        else {
            jwtValidation.refreshToken(req, res, jwt, jwtSecret);
        }
    });
});
//User routes
app.post('/user/signin', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userData = {
            username: "",
            email: req.body.email,
            password: req.body.password
        };
        const homeUrl = `${domainUrl}/home`;
        const checkEmailQuery = 'select * from usuario where email=?';
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
app.post('/user/checkUserExist', function (req, res) {
    const userData = {
        username: req.body.username,
        email: req.body.email,
        password: ""
    };
    getUser.checkIfUserExists(mySqlConnection, userData).then(result => {
        if (result)
            res.send({ exists: true });
        else {
            res.send({ exists: false });
        }
    });
});
app.post('/user/signup', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.password.length < 8) {
            res.status(400);
        }
        let message = null;
        let hashedPassword = yield hashing.hashPassword(req.body.password, 12);
        const userData = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        };
        const signupCheckQuery = 'select * from usuario where nome=?;select * from usuario where email=?';
        mySqlConnection.query(signupCheckQuery, [userData.username, userData.email], (err, results) => {
            if (err) {
                console.log(err);
            }
            else if (results[0].length > 0) {
                message = "Nome de usuário já está em uso";
            }
            else if (results[1].length > 0) {
                message = 'email já está em uso';
            }
            if (message) {
                res.send({ errorMessage: message, credentials: false });
            }
            else if (message == null) {
                addUser.addNewUser(mySqlConnection, userData);
                res.send({ credentials: true, errorMessage: "Cadastro Concluído" });
            }
        });
    });
});
app.post('/user/googleSignIn', function (req, res) {
    const userData = {
        username: req.body.username,
        email: req.body.email,
        password: ""
    };
    const googleUserInsertQuery = 'insert into usuario(nome,email,tipo_autenticacao) values(?,?,"google")';
<<<<<<< HEAD
    const getUserQuery = 'select * from usuario where email=?';
=======
    const getUserIdQuery = 'select * from usuario where email=?';
>>>>>>> 6c9b0abf17f20564cb3f11bec403c3e9585c8d70
    const isValidGoogleToken = firebase.checkGoogleToken(req.body.token).then(function () {
        if (isValidGoogleToken.error_description == "Invalid Value") {
            throw Error('token invalid');
        }
        else if (req.body.isNewUser) {
<<<<<<< HEAD
            mySqlConnection.query(googleUserInsertQuery, [userData.username, userData.email], (err, results) => { });
        }
        mySqlConnection.query(getUserQuery, [userData.email], (err, results) => {
=======
        }
        mySqlConnection.query(googleUserInsertQuery, [userData.username, userData.email], (err, results) => { });
        mySqlConnection.query(getUserIdQuery, [userData.email], (err, results) => {
>>>>>>> 6c9b0abf17f20564cb3f11bec403c3e9585c8d70
            jwtValidation.createTokens(jwt, jwtSecret, res, results);
        });
    });
});
//Establishments routes
app.get('/restaurant/getRestaurants', function (req, res) {
    getRestaurant.getAllRestaurants(mySqlConnection).then(results => {
        res.send(results);
    });
});
app.get('/restaurant/getRestaurant/:id', function (req, res) {
    const decoded = jwtValidation.isTokenValid(req, jwt, jwtSecret);
    if (decoded) {
        getRestaurant.getRestaurant(mySqlConnection, req.params.id, res).then(results => {
            if (results.length == 0) {
                res.status(404).send('Not found');
            }
            else {
                res.send(results);
            }
        });
    }
});
app.post('/estab/addRestaurant', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const decoded = jwtValidation.isTokenValid(req, jwt, jwtSecret);
        if (decoded) {
            /*const data : RestaurantData =  {
                
            }
            addRestaurant.addRestaurant(mySqlConnection,data);*/
        }
        else {
            res.status(400);
        }
    });
});
app.post('/estab/addRestaurant2', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = {
            nome: req.body.nome,
            contato: req.body.contato,
            horario_atendimento: req.body.horario_atendimento,
            dia_atendimento: req.body.dia_atendimento,
            tipo_cozinha: req.body.tipo_cozinha
        };
        addRestaurant.addRestaurant(mySqlConnection, data);
    });
});
app.post('/Restaurant/searchRestaurant', function (req, res) {
    const keyword = req.body.keyword;
    getRestaurant.searchRestaurant(mySqlConnection, keyword, res).then(results => {
        res.send(results);
    });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
