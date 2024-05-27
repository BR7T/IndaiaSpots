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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Express
const express = require("express");
const app = express();
// Firebase
const functions = __importStar(require("firebase-functions"));
//JWT
const cookieParser = require("cookie-parser");
//Helmet
const helmet_1 = __importDefault(require("helmet"));
//Routers
const userRoutes_1 = require("./Routes/userRoutes");
const restaurantRoutes_1 = require("./Routes/restaurantRoutes");
const ratingRoutes_1 = require("./Routes/ratingRoutes");
const addressRoutes_1 = require("./Routes/addressRoutes");
const promotionRoutes_1 = require("./Routes/promotionRoutes");
const jwtImplementation_1 = require("./middleware/jwt/jwtImplementation");
const firebase_1 = require("./middleware/firebase/firebase");
const jwtImplementation_2 = require("./middleware/jwt/jwtImplementation");
const getUser_1 = require("./user/getUser");
const mysql_1 = require("./middleware/db/mysql");
const imageRoutes_1 = require("./Routes/imageRoutes");
app.use(express.json());
app.use((0, helmet_1.default)());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/user', userRoutes_1.userRouter);
app.use('/restaurant', restaurantRoutes_1.restaurantRouter);
app.use('/rating', ratingRoutes_1.ratingRouter);
app.use('/address', addressRoutes_1.addressRouter);
app.use('/promotion', promotionRoutes_1.promotionRouter);
app.use('/image', imageRoutes_1.imageRouter);
app.get('/hi', firebase_1.appCheckVerification, function (req, res, next) {
    res.send('working as intended');
});
app.get('/checkToken', firebase_1.appCheckVerification, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.cookies.__session) {
            const cookie = (0, jwtImplementation_2.decodeJwt)(req.cookies.__session);
            (0, getUser_1.getUsernameById)(mysql_1.mySqlConnection, cookie.userId).then(results => {
                const isValid = (0, jwtImplementation_1.isTokenValid)(req);
                res.send({ isValid: isValid, username: results.username, email: results.email });
            });
        }
        else {
            const isValid = (0, jwtImplementation_1.isTokenValid)(req);
            res.send({ isValid: isValid });
        }
    });
});
app.get('/logout', firebase_1.appCheckVerification, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.cookies.__session) {
            res.status(400).send({ error: "Error on logout" });
        }
        else {
            res.status(200).clearCookie('__session', { domain: "", sameSite: 'none', secure: true }).send({ process: 'success' });
        }
    });
});
/* app.listen(3100 , function(){
    console.log('Server running on port: '+3100)
}) */
const allowedOrigins = [
    'http://127.0.0.1:5000',
    'http://localhost:5173',
    'https://indaiaspots.web.app',
];
exports.app = functions.region('southamerica-east1').https.onRequest((req, res) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.set('Access-Control-Allow-Origin', origin);
    }
    else {
        res.set('Access-Control-Allow-Origin', '');
    }
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Firebase-AppCheck');
    res.set('Access-Control-Allow-Credentials', 'true');
    app(req, res);
});
