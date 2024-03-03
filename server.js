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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
//Express
var express = require('express');
var path = require('path');
var port = 3100;
var app = express();
//mySQL
var mysql = require('mysql2');
var mysqlCon = require('./db/mysql.js');
//bcrypt
var bcrypt = require('bcrypt');
var saltRounds = 12;
// Jwt Authentication
var jwt = require('jsonwebtoken');
var jwtSecret = require('./jwtSecret.json');
//Cookie parser
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var fs = require('fs');
var privateKey = fs.readFileSync('PrivateKey.key', 'utf8');
//firebase
var admin = require('firebase-admin');
var firebaseCredentials = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentials)
});
app.use(express.static(path.join(__dirname, 'public')));
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
var mySqlConnection = mysqlCon.newConnection();
//Page serving
function pageRoutes(routesArray) {
    var _loop_1 = function (i) {
        app.get("/".concat(routesArray[i].routeName), function (req, res) {
            res.sendFile(path.join(__dirname, 'public', routesArray[i].fileName));
        });
    };
    for (var i = 0; i < routesArray.length; i++) {
        _loop_1(i);
    }
}
var routes = {
    pages: [
        { routeName: 'login', fileName: 'loginAndSignup.html' },
        { routeName: 'home', fileName: 'home.html' },
        { routeName: 'addEstabs', fileName: 'addEstab.html' },
        { routeName: 'emailVerification', fileName: 'emailVerification.html' }
    ]
};
pageRoutes(routes['pages']);
app.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (req.cookies.jwt6) {
                try {
                    /*if(await admin.auth().verifyIdToken(req.cookies.jwt6)) {
                        res.redirect('/home');
                        console.log('auth succeded');
                    }*/
                }
                catch (error) {
                    console.log(error);
                }
            }
            return [2 /*return*/];
        });
    });
});
app.post('/userSignin', function (req, res) {
    var userData = {
        email: req.body.email,
        password: req.body.password
    };
    var homeUrl = 'http://localhost:3100/home';
    var checkEmailQuery = 'select * from user where email=?';
    mySqlConnection.query(checkEmailQuery, [userData.email], function (err, results) {
        if (err)
            throw err;
        if (results.length > 0) {
            bcrypt.compare(req.body.password, results[0].password, function (err, resp) {
                if (err) {
                    console.log(err);
                }
                else if (resp) {
                    res.send({ credentials: true, redirect: homeUrl });
                }
                else {
                    res.send({ credentials: false, errorMessage: "Email ou senha inválidos" });
                }
            });
        }
        else {
            res.send({ credentials: false, errorMessage: "Email ou senha inválidos" });
        }
    });
});
function hashPassword(password, saltRounds) {
    return __awaiter(this, void 0, void 0, function () {
        var hash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcrypt.hash(password, saltRounds)];
                case 1:
                    hash = _a.sent();
                    return [2 /*return*/, hash];
            }
        });
    });
}
app.post('/checkUserExist', function (req, res) {
    var userData = {
        username: req.body.username,
        email: req.body.email,
    };
    var signupCheckQuery = 'select * from user where userName=? or where email=?';
    mySqlConnection.query(signupCheckQuery, [userData.username, userData.email], function (err, results) {
        if (results.length > 0) {
            res.send({ exists: true });
        }
        else {
            res.send({ exists: false });
        }
    });
});
app.post('/userSignup', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var message, hashedPassword, userData, signupCheckQuery, insertToDatabaseQuery;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    message = null;
                    return [4 /*yield*/, hashPassword(req.body.password, 12)];
                case 1:
                    hashedPassword = _a.sent();
                    userData = {
                        username: req.body.username,
                        email: req.body.email,
                        password: hashedPassword
                    };
                    signupCheckQuery = 'select * from user where userName=?; select * from user where email=?';
                    insertToDatabaseQuery = 'insert into user(userName,email,password) values (?,?,?)';
                    mySqlConnection.query(signupCheckQuery, [userData.username, userData.email], function (err, results) {
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
                            mySqlConnection.query(insertToDatabaseQuery, [userData.username, userData.email, userData.password], function (err, results) {
                                res.send({ credentials: true, errorMessage: "Cadastro Concluído" });
                            });
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
});
app.get('/getEstabs', function (req, res) {
    var getAllRestaurants = 'select * from establishments';
    mySqlConnection.query(getAllRestaurants, function (err, results) {
        res.send(results);
    });
});
app.post('/addEstab', function (req, res) {
    var data = {
        estabName: req.body.name,
        imageUrl: req.body.imageUrl,
        description: req.body.description
    };
    var checkIfExistsQuery = 'select * from establishments where name = ? or imageUrl = ? or description = ?';
    var insertQuery = 'insert into establishments(name,imageUrl,description) values(?,?,?)';
    mySqlConnection.query(checkIfExistsQuery, [data.estabName, data.imageUrl, data.description], function (err, results) {
        if (results.length == 0) {
            mySqlConnection.query(insertQuery, [data.estabName, data.imageUrl, data.description], function (err, results) {
                console.log('success');
                res.send({ message: "new establishment added successfully", query: true });
            });
        }
        else {
            res.send({ message: "name or background image URL already in use", query: false });
        }
    });
});
app.post('/searchEstab', function (req, res) {
    var searchQuery = "select * from establishments where name like CONCAT('%',?,'%')";
    var keyword = req.body.keyword;
    mySqlConnection.query(searchQuery, [keyword], function (err, results) {
        if (results.length > 0) {
            res.status(301).send(results);
        }
        else {
            res.status(404).send({ error: 'nothing found' });
        }
    });
});
function checkGoogleToken(token) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=".concat(token), {
                        method: 'GET',
                        mode: 'cors',
                        cache: 'default',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                    }).then(function (response) { return response.json(); }).then(function (response) {
                        return response;
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
app.post('/googleSignIn', function (req, res) {
    var homeUrl = "http://localhost:3100/home";
    var userName = req.body.username;
    var userEmail = req.body.email;
    var googleUserInfoQuery = 'insert into user(username,email,authentication_type) values(?,?,"google")';
    var isValidGoogleToken = checkGoogleToken(req.body.token).then(function () {
        if (isValidGoogleToken.error_description == "Invalid Value") {
            throw new Error('token invalid');
        }
        if (req.body.isNewUser) {
            mySqlConnection.query(googleUserInfoQuery, [userName, userEmail], function (err, results) { });
        }
        var idToken = req.body.idToken;
        var payload = {
            userId: idToken
        };
        var options = { 'expiresIn': '1h',
            algorithm: 'RS256',
            header: {
                kid: idToken
            }
        };
        var jwtToken = jwt.sign(payload, privateKey, options);
        /*admin.auth.createCustomToken(jwtToken).then(token => {
            res.cookie('jwt6', token, {secure : true, httpOnly : true});
            res.send({redirect : homeUrl});
        })*/
    });
});
app.listen(port, function () { return console.log("Example app listening on port ".concat(port, "!")); });
module.exports = { hashPassword: hashPassword };
