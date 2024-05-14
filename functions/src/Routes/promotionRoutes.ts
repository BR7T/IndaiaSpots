import { NextFunction, Request, Response, Router } from "express";
import * as express from 'express';
import { mySqlConnection } from "../middleware/db/mysql";
import { addPromotion, populatePromoDataObject } from "../promotion/addPromo";
import { deletePromo } from "../promotion/DeletePromo";
import { getPromoById, getPromos } from "../promotion/getPromo";

const promotionRouter : Router = express.Router();

promotionRouter.get("/getPromotion", async function(req: Request, res: Response, next: NextFunction) {
    getPromos(mySqlConnection).then(results => {
        if(results.length == 0) {
            res.send({error : "nenhuma promoção foi encontrada"})
        }
        else {
            res.send(results);
        }
    })
});

promotionRouter.get("/getPromotion/:id", async function (req: Request, res: Response, next: NextFunction) {
    const promocaoId = req.params.id;
    getPromoById(mySqlConnection, promocaoId, next).then(results => {
        res.send(results)
    })  
});

promotionRouter.post("/add", async function (req: Request, res: Response, next: NextFunction) {
    const promoData = populatePromoDataObject(req.body);
    addPromotion(mySqlConnection , promoData, next)
});

promotionRouter.delete("/delete/:id", async function (req: Request, res: Response, next: NextFunction) {
    const promoId = req.params.id;
    deletePromo(mySqlConnection, promoId);
});

promotionRouter.use((err : string,req : Request, res : Response , next : NextFunction) => {
  res.status(500).send('Erro interno do servidor');
})

export { promotionRouter };


