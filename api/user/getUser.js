"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfUserExists = exports.getAllUsers = exports.getUser = void 0;
function getUser(mysqlCon, userId) {
    const getUserQuery = 'select * from user where id_user = ?';
    mysqlCon.query(getUserQuery, [userId], (err, results) => {
        if (results.length == 0) {
            throw Error('user with that id not found');
        }
        else {
            return results;
        }
    });
}
exports.getUser = getUser;
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
            else {
                resolve(false);
            }
        });
    });
}
exports.checkIfUserExists = checkIfUserExists;
