import express, {Router, Request, Response} from 'express';
import {mySqlConnection} from '../middleware/db/mysql';
import {isTokenValid} from '../middleware/jwt/jwtImplementation';
import { getRestaurant, getAllRestaurants, searchRestaurant } from '../restaurant/getRestaurant';
import { addRestaurant, populateRestaurantDataObject } from '../restaurant/addRestaurant';
import { generateSignedUrl, getBucket} from '../middleware/aws/aws';

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

restaurantRouter.post('/addRestaurant', async function(req : any,res : Response) {
    const filename = req.query.filename;
    generateSignedUrl(filename, 60, res);
    /*const data = populateRestaurantDataObject(req);
    addRestaurant(mySqlConnection,data).then(function() {
        const file = req.file;
        //res.send({process : true}); 
    })*/
})

restaurantRouter.post('/searchRestaurant', function(req :Request ,res : Response) {
    const keyword : string = req.body.keyword;
    searchRestaurant(mySqlConnection,keyword).then(results => {
        res.send(results);
    })
})

export {restaurantRouter};


