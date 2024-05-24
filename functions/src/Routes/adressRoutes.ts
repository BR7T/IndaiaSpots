import { Router, Request, Response } from 'express';
import * as express from 'express';
import { mySqlConnection } from '../middleware/db/mysql';
import { addAddress } from '../address/addAdress';
import { appCheckVerification } from '../middleware/firebase/firebase';

const addressRouter: Router = express.Router();

addressRouter.post('/addAddress', appCheckVerification , function (req: Request, res: Response) {
    addAddress(mySqlConnection, req.body).then(response => {
        res.send({process : true})
    })
})

export { addressRouter };

