import { Router, Request, Response, NextFunction } from 'express';
import * as express from 'express';
import { mySqlConnection } from '../middleware/db/mysql';
import { getRestaurant, getAllRestaurants, searchRestaurant } from '../restaurant/getRestaurant';
import { addImage, addRestaurant, populateRestaurantDataObject } from '../restaurant/addRestaurant';
import { generateSignedUrl } from '../middleware/aws/aws';
import { updateRestaurant } from '../restaurant/updateRestaurant';
import { deleteRestaurant } from '../restaurant/deleteRestaurant';


const restaurantRouter: Router = express.Router();

restaurantRouter.get('/getRestaurants', function (req: Request, res: Response ,next : NextFunction) {
    getAllRestaurants(mySqlConnection, next).then(results => {
        res.send(results);
    })
})

restaurantRouter.get('/getRestaurant/:id', function (req: Request, res: Response) {
    getRestaurant(mySqlConnection, req.params.id).then(results => {
        if (results.length == 0) {
            res.status(404).send({ error: 'Not found' });
        }
        else {
            res.send(results);
        }
    })
})

restaurantRouter.get('/addRestaurant', async function (req: any, res: Response, next: NextFunction) {
    if (!req.query.filename) res.status(400);
    const filename = req.query.filename;
    req.file = {
        filename: filename,
        expirationTime: 60
    }
    generateSignedUrl(req, res, next).then(() => {
        const data = populateRestaurantDataObject(req);
        addRestaurant(mySqlConnection,data).then(function() {
            res.send({process : true}); 
        })
    })
})

restaurantRouter.post('/addImage', async function (req: Request, res: Response, next : NextFunction) {
    const url = req.body.filename;
    addImage(mySqlConnection, url);
})

restaurantRouter.post('/searchRestaurant', function (req: Request, res: Response, next: NextFunction) {
    const keyword: string = req.body.keyword;
    searchRestaurant(mySqlConnection, keyword).then(results => {
        res.send(results);
    })
})

restaurantRouter.put("/updateRestaurant/:id", async function (req: Request, res: Response, next: NextFunction) {
    const restaurantId = req.params.id;
    const updatedData = req.body;
    await updateRestaurant(mySqlConnection, parseInt(restaurantId) ,updatedData);
    res.status(200).send({ message: "Restaurante atualizado com sucesso" }); 
});

restaurantRouter.delete("/deleteRestaurant/:id", async function (req: Request, res: Response, next) {
    const restaurantId = req.params.id;
    await deleteRestaurant(mySqlConnection, parseInt(restaurantId));
    res.status(200).send({ message: "Restaurante excluído com sucesso" });  
});

restaurantRouter.use((err : string,req : Request, res : Response , next : NextFunction) => {
    res.status(500).send('Erro interno do servidor');
});

export { restaurantRouter };


