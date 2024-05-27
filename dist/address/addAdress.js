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
exports.checkIfInfoAlreadyTaken = exports.addAddress = void 0;
const restaurantRoutes_1 = require("../Routes/restaurantRoutes");
function addAddress(mysqlCon, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const addressQuery = 'INSERT INTO Endereco(Razao_Social, Bairro, Numero, CNPJ, Rua, ID_Restaurante) VALUES (?, ?, ?, ?, ?, ?)';
        const sanitizedParams = (0, restaurantRoutes_1.sanitizeParams)([data.RazaoSocial, data.Bairro, data.Numero, data.CNPJ, data.Rua, data.ID_Restaurante]);
        yield mysqlCon.execute(addressQuery, sanitizedParams); /* (err : QueryError | null)  => {
            if(err) {
                return next(err);
            };
            return true;
        }) */
    });
}
exports.addAddress = addAddress;
function checkIfInfoAlreadyTaken(err, req, res, next) {
    console.log(err.code);
    if (err.code == "ER_DUP_ENTRY") {
        if (err.sqlMessage.includes("CNPJ"))
            return res.status(200).send({ error: "Esse cnpj já está em uso!" });
        if (err.sqlMessage.includes("Razao_Social"))
            return res.status(200).send({ error: "Essa Razão Social já está em uso!" });
    }
    return next(err);
}
exports.checkIfInfoAlreadyTaken = checkIfInfoAlreadyTaken;
