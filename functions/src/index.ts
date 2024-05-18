//Express
import express = require('express');
import { NextFunction, Request, Response} from "express";
const app = express();

// Firebase
import * as functions from 'firebase-functions';

//JWT
import cookieParser = require('cookie-parser');

//Helmet
import helmet from 'helmet';

//Routers
import { userRouter } from "./Routes/userRoutes";
import { restaurantRouter } from "./Routes/restaurantRoutes";
import { ratingRouter } from './Routes/ratingRoutes';
import { addressRouter } from './Routes/adressRoutes';
import { promotionRouter } from './Routes/promotionRoutes';
import { isTokenValid } from './middleware/jwt/jwtImplementation';


app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(function (req: Request, res: any, next: NextFunction) {
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
app.use('/promotion', promotionRouter);

app.get('/hi', function (req: Request, res: Response, next: NextFunction) {
    res.send('working as intended');
})

app.get('/checkToken', async function (req: Request, res: Response, next: NextFunction) {
    const isValid = isTokenValid(req);
    res.send({isValid : isValid});
})

app.get('logout', async function (req: Request, res: Response, next: NextFunction) {
    if(!req.cookies.authorization && !req.cookies.refreshToken) {
        res.status(400).send({error : "No cookie found"})
    }
    else {
        res.clearCookie('authorization', {domain : 'http://localhost:5173'});
        res.clearCookie('refreshToken', {domain : 'http://localhost:5173'});
    }
})

app.listen(3001, function() {
    console.log('Server running');
})

exports.app = functions.region('southamerica-east1').https.onRequest(app);
