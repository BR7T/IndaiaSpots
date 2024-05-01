import express, {Router, Request, Response} from 'express';
import {mySqlConnection} from '../middleware/db/mysql';
import {isTokenValid} from '../middleware/jwt/jwtImplementation';
import { getRestaurant, getAllRestaurants, searchRestaurant } from '../restaurant/getRestaurant';
import { addImage, addRestaurant, populateRestaurantDataObject } from '../restaurant/addRestaurant';
import { generateSignedUrl} from '../middleware/aws/aws';
import { Next } from 'mysql2/typings/mysql/lib/parsers/typeCast';

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
                res.status(404).send({ error :'Not found'});
            }
            else {
                res.send(results);
            }
        })
    }
})

restaurantRouter.get('/addRestaurant', async function(req : any,res : Response, next : Next) {
    if(!req.query.filename) res.status(400);
    const filename = req.query.filename;
    req.file = {
        filename : filename,
        expirationTime : 60
    }
    generateSignedUrl(req.file, res, next);
    /*const data = populateRestaurantDataObject(req);
    addRestaurant(mySqlConnection,data).then(function() {
        const file = req.file;
        //res.send({process : true}); 
    })*/
})

restaurantRouter.post('/addImage', async function(req : any,res : Response) {
    const url = req.body.filename;
    addImage(mySqlConnection,url);
})

restaurantRouter.post('/searchRestaurant', function(req :Request ,res : Response) {
    const keyword : string = req.body.keyword;
    searchRestaurant(mySqlConnection,keyword).then(results => {
        res.send(results);
    })
})

export {restaurantRouter};


