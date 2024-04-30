import express, { Router, Request, Response } from "express";
import { mySqlConnection } from "../middleware/db/mysql";
import { isTokenValid } from "../middleware/jwt/jwtImplementation";
import {
  getRestaurant,
  getAllRestaurants,
  searchRestaurant,
} from "../restaurant/getRestaurant";
import {
  addImage,
  addRestaurant,
  populateRestaurantDataObject,
} from "../restaurant/addRestaurant";
import {
  updateRestaurant,
  deleteRestaurant,
} from "../restaurant/updateRestaurant";
import { generateSignedUrl } from "../middleware/aws/aws";

const restaurantRouter: Router = express.Router();

restaurantRouter.get("/getRestaurants", function (req: Request, res: Response) {
  getAllRestaurants(mySqlConnection).then((results) => {
    res.send(results);
  });
});

restaurantRouter.get(
  "/getRestaurant/:id",
  function (req: Request, res: Response) {
    const cookie = isTokenValid(req);
    if (cookie) {
      getRestaurant(mySqlConnection, req.params.id).then((results) => {
        if (results.length == 0) {
          res.status(404).send({ error: "Not found" });
        } else {
          res.send(results);
        }
      });
    }
  }
);

restaurantRouter.get(
  "/addRestaurant",
  async function (req: any, res: Response) {
    if (!req.query.filename) res.status(400);
    const filename = req.query.filename;
    generateSignedUrl(filename, 60, res);
  }
);

restaurantRouter.post("/addImage", async function (req: any, res: Response) {
  const url = req.body.filename;
  addImage(mySqlConnection, url);
});

restaurantRouter.post(
  "/searchRestaurant",
  function (req: Request, res: Response) {
    const keyword: string = req.body.keyword;
    searchRestaurant(mySqlConnection, keyword).then((results) => {
      res.send(results);
    });
  }
);

restaurantRouter.put(
  "/updateRestaurant/:id",
  async function (req: Request, res: Response) {
    const restaurantId = req.params.id;
    const updatedData = req.body;
    try {
      await updateRestaurant(
        mySqlConnection,
        parseInt(restaurantId),
        updatedData
      );
      res.status(200).send({ message: "Restaurante atualizado com sucesso" });
    } catch (error) {
      res.status(500).send({ error: "Erro interno do servidor" });
    } 
  } 
);

restaurantRouter.delete(
  "/deleteRestaurant/:id",
  async function (req: Request, res: Response) {
    const restaurantId = req.params.id;
    try {
      await deleteRestaurant(mySqlConnection, parseInt(restaurantId));
      res.status(200).send({ message: "Restaurante excluído com sucesso" });
    } catch (error) {
      res.status(500).send({ error: "Erro interno do servidor" });
    }
  }
);

export { restaurantRouter };
