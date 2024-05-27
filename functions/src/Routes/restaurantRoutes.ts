import { Router, Request, Response, NextFunction } from 'express';
import * as express from 'express';
import { mySqlConnection } from '../middleware/db/mysql';
import { getRestaurant, getAllRestaurants, searchRestaurant } from '../restaurant/getRestaurant';
import { updateRestaurant } from '../restaurant/updateRestaurant';
import { deleteRestaurant } from '../restaurant/deleteRestaurant';
import { appCheckVerification } from '../middleware/firebase/firebase';
import { addNewUserRestaurant } from '../user/addUser';
import { getUserIdByEmail } from '../user/getUser';
import { addAddress } from '../address/addAdress';


const restaurantRouter: Router = express.Router();

restaurantRouter.get('/getRestaurants', appCheckVerification , function (req: Request, res: Response ,next : NextFunction) {
    getAllRestaurants(mySqlConnection, next).then(results => {
        res.send(results);
    })
})

restaurantRouter.get('/getRestaurant/:id', appCheckVerification , function (req: Request, res: Response) {
    getRestaurant(mySqlConnection, req.params.id).then(results => {
        if (results.length == 0) {
            res.status(404).send({ error: 'Not found' });
        }
        else {
            res.send(results);
        }
    })
})

restaurantRouter.post('/searchRestaurant', appCheckVerification , function (req: Request, res: Response, next: NextFunction) {
    const keyword: string = req.body.keyword;
    searchRestaurant(mySqlConnection, keyword).then(results => {
        res.send(results);
    })
})

restaurantRouter.put("/updateRestaurant/:id", appCheckVerification , async function (req: Request, res: Response, next: NextFunction) {
    const restaurantId = req.params.id;
    const updatedData = req.body;
    await updateRestaurant(mySqlConnection, parseInt(restaurantId) ,updatedData);
    res.status(200).send({ message: "Restaurante atualizado com sucesso" }); 
});

restaurantRouter.delete("/deleteRestaurant/:id", appCheckVerification , async function (req: Request, res: Response, next) {
    const restaurantId = req.params.id;
    await deleteRestaurant(mySqlConnection, parseInt(restaurantId));
    res.status(200).send({ message: "Restaurante excluído com sucesso" });  
});

restaurantRouter.use((err : string,req : Request, res : Response , next : NextFunction) => {
    res.status(500).send('Erro interno do servidor');
});

export function sanitizeParams(params : any) {
    return params.map((param: undefined) => param === undefined ? null : param);
}


restaurantRouter.post('/registerRestaurant', appCheckVerification , async function (req: Request, res: Response, next: NextFunction) {
    try {
        await mySqlConnection.promise().beginTransaction();

        const userLogin = req.body.Login;
        userLogin.permissionLevel = 'Restaurante';
        const address = req.body.Address;
        
        await addNewUserRestaurant(mySqlConnection, userLogin)
    
        getUserIdByEmail(mySqlConnection, userLogin.email).then(restaurantId => {
            address.ID_Restaurante = restaurantId;
            addAddress(mySqlConnection, address); 
        })

        await mySqlConnection.promise().commit();
        res.status(201).json({ message: 'Restaurant registered successfully' });
    } 
      catch (error : any) {
        await mySqlConnection.promise().rollback();
        console.log(error.message)
        let step;
        if (error.message.includes('Usuario')) {
          step = 'Usuario';
        } else if (error.message.includes('Endereco')) {
          step = 'Endereço';
        } else {
          step = 'Outros';
          step = "OUtros 2"
        }
        res.status(400).json({ error: `Erro no registro do ${step}`});
    } finally {
        
    } 
});


export { restaurantRouter };


