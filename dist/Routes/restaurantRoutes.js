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
exports.restaurantRouter = exports.sanitizeParams = void 0;
const express = __importStar(require("express"));
const mysql_1 = require("../middleware/db/mysql");
const getRestaurant_1 = require("../restaurant/getRestaurant");
const updateRestaurant_1 = require("../restaurant/updateRestaurant");
const deleteRestaurant_1 = require("../restaurant/deleteRestaurant");
const firebase_1 = require("../middleware/firebase/firebase");
const addUser_1 = require("../user/addUser");
const getUser_1 = require("../user/getUser");
const addAdress_1 = require("../address/addAdress");
const restaurantRouter = express.Router();
exports.restaurantRouter = restaurantRouter;
restaurantRouter.get('/getRestaurants', firebase_1.appCheckVerification, function (req, res, next) {
    (0, getRestaurant_1.getAllRestaurants)(mysql_1.mySqlConnection, next).then(results => {
        res.send(results);
    });
});
restaurantRouter.get('/getRestaurant/:id', firebase_1.appCheckVerification, function (req, res) {
    (0, getRestaurant_1.getRestaurant)(mysql_1.mySqlConnection, req.params.id).then(results => {
        if (results.length == 0) {
            res.status(404).send({ error: 'Not found' });
        }
        else {
            res.send(results);
        }
    });
});
restaurantRouter.post('/searchRestaurant', firebase_1.appCheckVerification, function (req, res, next) {
    const keyword = req.body.keyword;
    (0, getRestaurant_1.searchRestaurant)(mysql_1.mySqlConnection, keyword).then(results => {
        res.send(results);
    });
});
restaurantRouter.put("/updateRestaurant/:id", firebase_1.appCheckVerification, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const restaurantId = req.params.id;
        const updatedData = req.body;
        yield (0, updateRestaurant_1.updateRestaurant)(mysql_1.mySqlConnection, parseInt(restaurantId), updatedData);
        res.status(200).send({ message: "Restaurante atualizado com sucesso" });
    });
});
restaurantRouter.delete("/deleteRestaurant/:id", firebase_1.appCheckVerification, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const restaurantId = req.params.id;
        yield (0, deleteRestaurant_1.deleteRestaurant)(mysql_1.mySqlConnection, parseInt(restaurantId));
        res.status(200).send({ message: "Restaurante excluído com sucesso" });
    });
});
restaurantRouter.use((err, req, res, next) => {
    res.status(500).send('Erro interno do servidor');
});
function sanitizeParams(params) {
    return params.map((param) => param === undefined ? null : param);
}
exports.sanitizeParams = sanitizeParams;
restaurantRouter.post('/registerRestaurant', firebase_1.appCheckVerification, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mysql_1.mySqlConnection.promise().beginTransaction();
            const userLogin = req.body.Login;
            userLogin.permissionLevel = 'Restaurante';
            const address = req.body.Address;
            yield (0, addUser_1.addNewUserRestaurant)(mysql_1.mySqlConnection, userLogin);
            (0, getUser_1.getUserIdByEmail)(mysql_1.mySqlConnection, userLogin.email).then(restaurantId => {
                address.ID_Restaurante = restaurantId;
                (0, addAdress_1.addAddress)(mysql_1.mySqlConnection, address);
            });
            yield mysql_1.mySqlConnection.promise().commit();
            res.status(201).json({ message: 'Restaurant registered successfully' });
        }
        catch (error) {
            yield mysql_1.mySqlConnection.promise().rollback();
            console.log(error.message);
            let step;
            if (error.message.includes('Usuario')) {
                step = 'Usuario';
            }
            else if (error.message.includes('Endereco')) {
                step = 'Endereço';
            }
            else {
                step = 'Outros';
            }
            res.status(400).json({ error: `Erro no registro do ${step}` });
        }
        finally {
        }
    });
});
