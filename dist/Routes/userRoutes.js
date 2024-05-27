"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.userRouter = void 0;
const express = __importStar(require("express"));
const hashing_1 = require("../middleware/bcrypt/hashing");
const mysql_1 = require("../middleware/db/mysql");
const jwtImplementation_1 = require("../middleware/jwt/jwtImplementation");
const addUser_1 = require("../user/addUser");
const getUser_1 = require("../user/getUser");
const addUser_2 = require("../user/addUser");
const firebase_1 = require("../middleware/firebase/firebase");
const deleteUser_1 = require("../user/deleteUser");
const userRouter = express.Router();
exports.userRouter = userRouter;
userRouter.post('/signin', firebase_1.appCheckVerification, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const permissionLevel = "Comum";
        const userData = (0, addUser_1.populateUserDataObject)(req, permissionLevel);
        (0, getUser_1.getUserByEmail)(mysql_1.mySqlConnection, userData.email).then((results) => __awaiter(this, void 0, void 0, function* () {
            if (results.length == 0)
                res.send({ error: "email ou senha inválidos" });
            else {
                if (typeof results[0] === 'object' && 'Senha' in results[0] && typeof results[0].Senha === 'string') {
                    yield (0, hashing_1.comparePassword)(req.body.password, results[0].Senha).then((isPasswordEqual) => {
                        req.body.User = results[0];
                        if (!isPasswordEqual) {
                            res.send({ error: "email ou senha inválidos" });
                        }
                        else {
                            (0, jwtImplementation_1.createTokens)(req, res, next);
                        }
                    });
                }
            }
        }));
    });
});
userRouter.post('/signup', firebase_1.appCheckVerification, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.confirmPassword.length < 8) {
            res.status(400).send({ error: "password must have 8 or more characters" });
        }
        const permissionLevel = "Comum";
        let hashedPassword = yield (0, hashing_1.hashPassword)(req.body.confirmPassword, 12);
        const userData = {
            username: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            permissionLevel: permissionLevel
        };
        (0, addUser_1.addNewUser)(mysql_1.mySqlConnection, userData, next).then(() => {
            res.send({ process: true });
        });
    });
});
userRouter.post('/signupRestaurant', firebase_1.appCheckVerification, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.confirm.length < 8) {
            res.status(400).send({ error: "password must have 8 or more characters" });
        }
        const permissionLevel = "Restaurante";
        let hashedPassword = yield (0, hashing_1.hashPassword)(req.body.confirm, 12);
        const userData = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            permissionLevel: permissionLevel
        };
        (0, addUser_1.addNewUserRestaurant)(mysql_1.mySqlConnection, userData).then(() => {
            (0, getUser_1.getUserIdByEmail)(mysql_1.mySqlConnection, userData.email).then(response => {
                res.send({ process: true, restaurantId: response });
            });
        });
    });
});
userRouter.use(addUser_2.checkIfUsernameOrEmailAlreadyTaken);
userRouter.post('/googleSignIn', firebase_1.appCheckVerification, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const permissionLevel = "Comum";
        const userData = (0, addUser_1.populateUserDataObject)(req, permissionLevel);
        if (req.body.isNewUser) {
            (0, addUser_1.addNewUserGoogle)(mysql_1.mySqlConnection, userData).then(() => {
                (0, getUser_1.getUserByEmail)(mysql_1.mySqlConnection, userData.email).then((results) => {
                    req.body.User = results[0];
                    (0, jwtImplementation_1.createTokens)(req, res, next);
                });
            });
        }
        else {
            (0, getUser_1.getUserByEmail)(mysql_1.mySqlConnection, userData.email).then((results) => {
                req.body.User = results[0];
                (0, jwtImplementation_1.createTokens)(req, res, next);
            });
        }
    });
});
userRouter.post('/delete', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.query.email)
            res.send(500);
        (0, deleteUser_1.deleteUserByEmail)(mysql_1.mySqlConnection, req.query.email).then(response => {
            res.send({ process: true });
        });
    });
});
userRouter.use((err, req, res, next) => {
    res.status(500).send('Something went wrong');
});
