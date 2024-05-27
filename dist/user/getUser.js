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
exports.checkIfUserExistsByEmail = exports.checkIfUserExists = exports.getAllUsers = exports.getUserIdByEmail = exports.getUserByEmail = exports.getUsernameById = exports.getUserById = void 0;
function getUserById(mysqlCon, userId) {
    const getUserQuery = 'select * from Usuario where ID_Usuario = ?';
    return new Promise((resolve, reject) => {
        mysqlCon.query(getUserQuery, [userId], (err, results) => {
            if (err)
                reject(err);
            else {
                resolve(results);
            }
        });
    });
}
exports.getUserById = getUserById;
function getUsernameById(mysqlCon, userId) {
    const getUserQuery = 'select * from Usuario where ID_Usuario = ?';
    return new Promise((resolve, reject) => {
        mysqlCon.query(getUserQuery, [userId], (err, results) => {
            if (err)
                reject(err);
            else {
                const email = results[0].email;
                const username = results[0].Nome;
                const array = {
                    email: email,
                    username: username
                };
                resolve(array);
            }
        });
    });
}
exports.getUsernameById = getUsernameById;
function getUserByEmail(mysqlCon, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const getUserQuery = 'select * from Usuario where email = ?';
        return new Promise((resolve, reject) => {
            mysqlCon.query(getUserQuery, [email], (err, results) => {
                if (err)
                    reject(err);
                else {
                    resolve(results);
                }
            });
        });
    });
}
exports.getUserByEmail = getUserByEmail;
function getUserIdByEmail(mysqlCon, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const getUserQuery = 'select * from Usuario where email = ?';
        return new Promise((resolve, reject) => {
            mysqlCon.query(getUserQuery, [email], (err, results) => {
                if (err)
                    reject(err);
                else {
                    resolve(results[0].ID_Usuario);
                }
            });
        });
        /*     const sanitizedParams = sanitizeParams([email]);
            const rows : any = await mysqlCon.promise().execute(getUserQuery, sanitizedParams);
            console.log(rows);
            if (rows.length == 0) {
                throw new Error('User not found');
            }
        
            return rows[0].ID_Usuario; */
    });
}
exports.getUserIdByEmail = getUserIdByEmail;
function getAllUsers(mysqlCon) {
    const getUserQuery = 'select * from establishments';
    return new Promise((resolve, reject) => {
        mysqlCon.query(getUserQuery, (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.getAllUsers = getAllUsers;
function checkIfUserExists(mysqlCon, userData) {
    const signupCheckQuery = 'select * from user where userName=? or email=?';
    return new Promise((resolve, reject) => {
        mysqlCon.query(signupCheckQuery, [userData.username, userData.email], (err, results) => {
            if (err) {
                reject(err);
            }
            else if (results && results.length > 0) {
                resolve(true);
            }
            resolve(false);
        });
    });
}
exports.checkIfUserExists = checkIfUserExists;
function checkIfUserExistsByEmail(mysqlCon, userData) {
    return __awaiter(this, void 0, void 0, function* () {
        const checkEmailQuery = 'select * from usuario where email=?';
        return new Promise((resolve, reject) => {
            mysqlCon.query(checkEmailQuery, [userData.email], (err, results) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    reject(err);
                if (results.length > 0) {
                    resolve(true);
                }
                resolve(false);
            }));
        });
    });
}
exports.checkIfUserExistsByEmail = checkIfUserExistsByEmail;
