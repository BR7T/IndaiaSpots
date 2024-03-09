"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewUser = void 0;
function addNewUser(mysqlCon, userData) {
    const addUserQuery = 'insert into user(userName,email,password) values (?,?,?)';
    mysqlCon.query(addUserQuery, [userData.username, userData.email, userData.password], (err, results) => {
        if (err) {
            throw Error('query to insert new user failed');
        }
    });
}
exports.addNewUser = addNewUser;
