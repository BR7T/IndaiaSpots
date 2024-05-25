import { Router, Request, Response, NextFunction } from 'express';
import * as express from 'express';
import { mySqlConnection } from '../middleware/db/mysql';
import { addAddress, checkIfInfoAlreadyTaken } from '../address/addAdress';
import { appCheckVerification } from '../middleware/firebase/firebase';

const addressRouter: Router = express.Router();

addressRouter.post('/addAddress', appCheckVerification , function (req: Request, res: Response, next : NextFunction) {
    addAddress(mySqlConnection, req.body, next).then(response => {
        if(response) {
            res.send({process : response})
        }
    })
})

addressRouter.use(checkIfInfoAlreadyTaken);

addressRouter.use((err : string ,req : Request, res : Response , next : NextFunction) : void => {
    res.status(500).send('Something went wrong');
})

export { addressRouter };

