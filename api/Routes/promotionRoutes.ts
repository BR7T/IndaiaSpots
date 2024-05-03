import express, { NextFunction, Request, Response, Router } from "express";
import { mySqlConnection } from "../middleware/db/mysql";
import { addPromotion, populatePromoDataObject } from "../promote/addPromo";
import { deletePromo } from "../promote/DeletePromo";
import { getPromoById, getPromos } from "../promote/getPromo";

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

promotionRouter.put("/encerrar", async function (req: Request, res: Response, next: NextFunction) {
    const tempo = req.body;
    if (!tempo) {
      return res.status(400).send({ error: 'O parâmetro "tempo" é obrigatório' });
    }
    res.status(200).send({ message: "Promoções encerradas com sucesso" });
});

promotionRouter.use((error, req, res, next) => {
  res.status(500).send('Erro interno do servidor');
})

export { promotionRouter };


