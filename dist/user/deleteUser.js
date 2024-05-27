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
exports.deleteUserByEmail = exports.deleteUser = void 0;
function deleteUser(mysqlCon, userId) {
    const deleteUserQuery = "DELETE FROM Usuario WHERE ID_Usuario=?";
    return new Promise((resolve, reject) => {
        mysqlCon.query(deleteUserQuery, [userId], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve('success');
        });
    });
}
exports.deleteUser = deleteUser;
function deleteUserByEmail(mysqlCon, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const deleteUserQuery = "DELETE FROM Usuario WHERE email=?";
        console.log(email);
        return new Promise((resolve, reject) => {
            mysqlCon.query(deleteUserQuery, [email], (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve('success');
            });
        });
    });
}
exports.deleteUserByEmail = deleteUserByEmail;
