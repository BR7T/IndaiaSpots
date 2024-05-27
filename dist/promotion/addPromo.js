"use strict";
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
exports.populatePromoDataObject = exports.addPromotion = void 0;
const mysql_1 = require("../middleware/db/mysql");
function addPromotion(mysqlCon, promoData, next) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO Promocoes (ID_Restaurante, Data_Inicio, Data_Final, Hora_Inicio, Hora_Final, Regras, Pratos) VALUES (?, ?, ?, ?, ?, ?, ?)";
            mysql_1.mySqlConnection.query(query, [
                promoData.ID_Restaurante,
                promoData.Data_Inicio,
                promoData.Data_Final,
                promoData.Hora_Inicio,
                promoData.Hora_Final,
                promoData.Regras,
                promoData.Pratos,
            ], (err, results) => {
                if (err) {
                    next(err);
                }
                else {
                    resolve('success');
                }
            });
        });
    });
}
exports.addPromotion = addPromotion;
;
function populatePromoDataObject(promoData) {
    const promoDataObject = {
        ID_Restaurante: promoData.ID_Restaurante,
        Data_Inicio: promoData.Data_Inicio,
        Data_Final: promoData.Data_Final,
        Hora_Inicio: promoData.Hora_Inicio,
        Hora_Final: promoData.Hora_Final,
        Regras: promoData.Regras,
        Pratos: promoData.Pratos,
    };
    return promoDataObject;
}
exports.populatePromoDataObject = populatePromoDataObject;
