import express, {Router, Request, Response} from 'express';
import { RestaurantData } from '../types/restaurantData';
import {compare,hashPassword} from '../middleware/bcrypt/hashing';
import {mySqlConnection} from '../middleware/db/mysql';
import {createTokens,isTokenValid} from '../middleware/jwt/jwtImplementation';
import { getRestaurant, getAllRestaurants, searchRestaurant } from '../restaurant/getRestaurant';
import { addRestaurant } from '../restaurant/addRestaurant';
import { populateRestaurantDataObject } from '../restaurant/addRestaurant';

const restaurantRouter : Router = express.Router();

restaurantRouter.get('/getRestaurants', function(req : Request,res : Response) {     
    getAllRestaurants(mySqlConnection).then(results => {
        res.send(results);
    })
})

restaurantRouter.get('/getRestaurant/:id', function(req : Request,res : Response) {     
    const cookie = isTokenValid(req);
    if(cookie) {
        getRestaurant(mySqlConnection,req.params.id).then(results => {
            if(results.length == 0) {
                res.status(404).send('Not found')
            }
            else {
                res.send(results);
            }
        })
    }
})

restaurantRouter.post('/addRestaurant', async function(req : Request,res : Response) {
    const cookieJwt = isTokenValid(req);
    if(cookieJwt) {
        const data = populateRestaurantDataObject(req);
        addRestaurant(mySqlConnection,data);
    }
    else {
        res.status(400);
    }
})

restaurantRouter.post('/searchRestaurant', function(req :Request ,res : Response) {
    const keyword : string = req.body.keyword;
    searchRestaurant(mySqlConnection,keyword).then(results => {
        res.send(results);
    })
})

export {restaurantRouter};