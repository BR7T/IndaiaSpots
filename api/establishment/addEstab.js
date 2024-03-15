"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEstab = void 0;
function addEstab(mysqlCon, estabData) {
    const insertQuery = 'insert into establishments(name,imageUrl,description) values(?,?,?)';
    return new Promise((resolve, reject) => {
        mysqlCon.query(insertQuery, [estabData.estabName, estabData.imageUrl, estabData.description], (err, results) => { });
    });
}
exports.addEstab = addEstab;
