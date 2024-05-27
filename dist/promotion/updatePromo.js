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
exports.updatePromos = void 0;
function updatePromos(mysqlCon, promoId, updatedData) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const updatePromotionQuery = "UPDATE Promocoes SET ID_Restaurante=?, Data_Inicio=?, Data_Final=?, Hora_Inicio=?, Hora_Final=?, Regras=?, Pratos=? WHERE id_promocoes=?";
            mysqlCon.query(updatePromotionQuery, [
                updatedData.ID_Restaurante,
                updatedData.Data_Inicio,
                updatedData.Data_Final,
                updatedData.Hora_Inicio,
                updatedData.Hora_Final,
                updatedData.Regras,
                updatedData.Pratos,
                promoId
            ], (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve('success');
            });
        });
    });
}
exports.updatePromos = updatePromos;
;
