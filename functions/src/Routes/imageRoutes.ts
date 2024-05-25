import { Router, Request, Response, NextFunction } from 'express';
import * as express from 'express';
import { mySqlConnection } from '../middleware/db/mysql';
import { appCheckVerification } from '../middleware/firebase/firebase';
import { generateSignedUrl } from '../middleware/aws/aws';
import { addImage } from '../image/addImage';

const imageRouter : Router = express.Router();

imageRouter.get('/signedUrl', appCheckVerification , async function (req:Request , res: Response, next: NextFunction) {
    if (!req.query.filename) res.status(400);
    const filename = req.query.filename;
    req.body.file = {
        filename: filename,
        expirationTime: 60
    }
    generateSignedUrl(req, res, next).then(() => {})
})

imageRouter.post('/addImage', appCheckVerification , async function (req: Request, res: Response, next : NextFunction) {
    const body = req.body;
    addImage(mySqlConnection, body).then(response => {
        res.send(response);
    })
})

export {imageRouter};