//Express
import express from 'express';
import { NextFunction, Request, Response } from "express";
const port = 3100;
const app = express();

//JWT
import cookieParser from 'cookie-parser';
import {isTokenValid,refreshToken} from './middleware/jwt/jwtImplementation';

//Helmet
import helmet from 'helmet';

//Routers
import {userRouter} from "./Routes/userRoutes";
import {restaurantRouter} from "./Routes/restaurantRoutes"; 
import { ratingRouter } from './Routes/ratingRoutes';
import { addressRouter } from './Routes/adressRoutes';

app.use(express.json());  
app.use(helmet());     
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(function (req : Request, res : any, next : NextFunction) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/user', userRouter);
app.use('/restaurant', restaurantRouter);
app.use('/rating', ratingRouter);
app.use('/address', addressRouter);

app.listen(3000, () => {
    console.log('Servidor está rodando na porta 3000');
});