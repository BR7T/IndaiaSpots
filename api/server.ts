//Express
const express = require('express');
import { NextFunction, Request, Response } from "express";
const port = 3100;
const app = express();

//JWT
const cookieParser = require('cookie-parser');
const jwtImplementation = require('./middleware/jwt/jwtImplementation');

//Routers
import router from "./Routes/userRoutes";
import restaurantRouter from "./Routes/restaurantRoutes"; 

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

app.use('/user', router);
app.use('/restaurant', restaurantRouter);

app.get('/', async function(req : Request,res : Response) {
    if(jwtImplementation.isTokenValid(req)) {
        res.redirect('/home');
    }
    else {
        jwtImplementation.refreshToken(req,res);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

