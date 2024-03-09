"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getUser = void 0;
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
