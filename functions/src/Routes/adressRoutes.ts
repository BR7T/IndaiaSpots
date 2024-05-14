import { Router, Request, Response } from 'express';
import * as express from 'express';
import { mySqlConnection } from '../middleware/db/mysql';
import { addAddress } from '../address/addAdress';

const addressRouter: Router = express.Router();

addressRouter.post('/addAdress', function (req: Request, res: Response) {
    addAddress(mySqlConnection, req.body);
})

export { addressRouter };

