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
exports.getPromoById = exports.getPromos = void 0;
function getPromos(mysqlCon) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM Promocoes";
            mysqlCon.query(query, (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(results);
            });
        });
    });
}
exports.getPromos = getPromos;
function getPromoById(mysqlCon, promoId, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = "SELECT * FROM Promocoes WHERE ID_Promocoes = ?";
        return new Promise((resolve, reject) => {
            mysqlCon.query(query, [promoId], (err, results) => {
                if (err) {
                    next(err);
                }
                else {
                    resolve(results[0]);
                }
            });
        });
    });
}
exports.getPromoById = getPromoById;
