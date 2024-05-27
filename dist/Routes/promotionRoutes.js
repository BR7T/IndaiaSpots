"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promotionRouter = void 0;
const express = __importStar(require("express"));
const mysql_1 = require("../middleware/db/mysql");
const addPromo_1 = require("../promotion/addPromo");
const DeletePromo_1 = require("../promotion/DeletePromo");
const getPromo_1 = require("../promotion/getPromo");
const firebase_1 = require("../middleware/firebase/firebase");
const promotionRouter = express.Router();
exports.promotionRouter = promotionRouter;
promotionRouter.get("/getPromotion", firebase_1.appCheckVerification, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, getPromo_1.getPromos)(mysql_1.mySqlConnection).then(results => {
            if (results.length == 0) {
                res.send({ error: "nenhuma promoção foi encontrada" });
            }
            else {
                res.send(results);
            }
        });
    });
});
promotionRouter.get("/getPromotion/:id", firebase_1.appCheckVerification, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const promocaoId = req.params.id;
        (0, getPromo_1.getPromoById)(mysql_1.mySqlConnection, promocaoId, next).then(results => {
            res.send(results);
        });
    });
});
promotionRouter.post("/add", firebase_1.appCheckVerification, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const promoData = (0, addPromo_1.populatePromoDataObject)(req.body);
        (0, addPromo_1.addPromotion)(mysql_1.mySqlConnection, promoData, next);
    });
});
promotionRouter.delete("/delete/:id", firebase_1.appCheckVerification, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const promoId = req.params.id;
        (0, DeletePromo_1.deletePromo)(mysql_1.mySqlConnection, promoId);
    });
});
promotionRouter.use((err, req, res, next) => {
    res.status(500).send('Erro interno do servidor');
});
