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
exports.populateUserDataObject = exports.addNewUserGoogle = exports.checkIfUsernameOrEmailAlreadyTaken = exports.addNewUserRestaurant = exports.addNewUser = void 0;
const restaurantRoutes_1 = require("../Routes/restaurantRoutes");
function addNewUser(mysqlCon, userData, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authType = "form";
        const addUserQuery = 'insert into Usuario(nome,email,senha,tipo_autenticacao,Nivel_Permissao) values (?,?,?,?,?)';
        mysqlCon.query(addUserQuery, [userData.username, userData.email, userData.password, authType, userData.permissionLevel], (err, results) => {
            if (err) {
                return next(err);
            }
            return true;
        });
    });
}
exports.addNewUser = addNewUser;
function addNewUserRestaurant(mysqlCon, userData) {
    return __awaiter(this, void 0, void 0, function* () {
        const authType = "form";
        const addUserQuery = 'insert into Usuario(nome,email,senha,tipo_autenticacao,Nivel_Permissao) values (?,?,?,?,?)';
        const sanitizedParams = (0, restaurantRoutes_1.sanitizeParams)([userData.username, userData.email, userData.password, authType, userData.permissionLevel]);
        mysqlCon.promise().execute(addUserQuery, sanitizedParams); /* (err: QueryError | null, results: any) => {
            if (err) {
                return next(err);
            }
            return true;
        }); */
    });
}
exports.addNewUserRestaurant = addNewUserRestaurant;
function checkIfUsernameOrEmailAlreadyTaken(err, req, res, next) {
    console.log(err);
    if (err.code === "ER_DUP_ENTRY") {
        if (err.sqlMessage.includes("email"))
            return res.status(200).send({ error: "Esse email já está em uso!" });
        if (err.sqlMessage.includes("Nome"))
            return res.status(200).send({ error: "Esse nome de usuário já está em uso!" });
    }
    return next(err);
}
exports.checkIfUsernameOrEmailAlreadyTaken = checkIfUsernameOrEmailAlreadyTaken;
function addNewUserGoogle(mysqlCon, userData) {
    return __awaiter(this, void 0, void 0, function* () {
        const googleUserInsertQuery = 'insert into Usuario(Nome,Email,tipo_autenticacao,Nivel_Permissao) values(?,?,"google",?)';
        mysqlCon.query(googleUserInsertQuery, [userData.username, userData.email, userData.permissionLevel], (err, results) => {
            if (err)
                throw err;
        });
    });
}
exports.addNewUserGoogle = addNewUserGoogle;
function populateUserDataObject(data, permissionLevels) {
    const userData = {
        username: data.body.username,
        email: data.body.email,
        password: data.body.password,
        permissionLevel: permissionLevels
    };
    return userData;
}
exports.populateUserDataObject = populateUserDataObject;
