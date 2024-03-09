"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchEstab = exports.getAllEstabs = exports.getEstab = void 0;
function getEstab(mysqlCon, estabId) {
    const getEstabQuery = 'select * from establishments where id_establishments = ?';
    mysqlCon.query(getEstabQuery, [estabId], (err, results) => {
        if (results.length == 0) {
            throw Error('establishment with that id not found');
        }
        else {
            return results;
        }
    });
}
exports.getEstab = getEstab;
function getAllEstabs(mysqlCon) {
    const getEstabQuery = 'select * from establishments';
    return new Promise((resolve, reject) => {
        mysqlCon.query(getEstabQuery, (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.getAllEstabs = getAllEstabs;
function searchEstab(mysqlCon, keyword) {
    const searchQuery = "select * from establishments where name like CONCAT('%',?,'%')";
    return new Promise((resolve, reject) => {
        mysqlCon.query(searchQuery, [keyword], (err, results) => {
            if (err)
                reject(err);
            else {
                resolve(results);
            }
        });
    });
}
exports.searchEstab = searchEstab;
