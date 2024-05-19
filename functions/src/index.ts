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
import { appCheckVerification } from './middleware/firebase/auth';

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/user', userRouter);
app.use('/restaurant', restaurantRouter);
app.use('/rating', ratingRouter);
app.use('/address', addressRouter);
app.use('/promotion', promotionRouter);

app.get('/hi', appCheckVerification ,function (req: Request, res: Response, next: NextFunction) {
    res.send('working as intended');
})

app.get('/checkToken', appCheckVerification , async function (req: Request, res: Response, next: NextFunction) {
    const isValid = isTokenValid(req);
    res.send({isValid : isValid});
})

app.get('/logout', appCheckVerification ,async function (req: Request, res: Response, next: NextFunction) {
    if(!req.cookies.__session) {
        res.status(400).send({error : "Error on logout"})
    }
    else {
        res.status(200).clearCookie('__session', {domain : ""}).send({process : 'success'});
    }
})

/* app.listen(3100 , function(){
    console.log('Server running on port: '+3100)
}) */

const allowedOrigins = [
    'http://127.0.0.1:5000',
    'http://localhost:5173',
    'https://indaiaspots.web.app',
];

exports.app = functions.region('southamerica-east1').https.onRequest((req, res) => {
    const origin : any = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.set('Access-Control-Allow-Origin', origin);
    } else {
        res.set('Access-Control-Allow-Origin', '');
    }
    
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Firebase-AppCheck');
    res.set('Access-Control-Allow-Credentials', 'true');

    app(req,res);
})
