import { Router, Request, Response } from 'express';
import * as express from 'express';
import { mySqlConnection } from '../middleware/db/mysql';
import { addRating } from '../rating/addRating';

const ratingRouter: Router = express.Router();

ratingRouter.post('/addRating', function (req: Request, res: Response) {
    addRating(mySqlConnection, req.body);
})

export { ratingRouter };