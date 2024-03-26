"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchEstab = exports.getAllRestaurants = exports.getRestaurant = void 0;
function getRestaurant(mysqlCon, restaurantId) {
    const getRestaurantQuery = 'select * from restaurante where id_restaurante = ?';
    return new Promise((resolve, reject) => {
        mysqlCon.query(getRestaurantQuery, [restaurantId], (err, results) => {
            if (err)
                reject(err);
            else {
                resolve(results);
            }
        });
    });
}
exports.getRestaurant = getRestaurant;
function getAllRestaurants(mysqlCon) {
    const getAllRestaurantQuery = 'select * from restaurante';
    return new Promise((resolve, reject) => {
        mysqlCon.query(getAllRestaurantQuery, (err, results) => {
            if (err)
                reject(err);
            else {
                resolve(results);
            }
        });
    });
}
exports.getAllRestaurants = getAllRestaurants;
function searchEstab(mysqlCon, keyword) {
    const searchQuery = "select * from restaurantes where nome like CONCAT('%',?,'%') and approved=?";
    const isApproved = true;
    return new Promise((resolve, reject) => {
        mysqlCon.query(searchQuery, [keyword, isApproved], (err, results) => {
            if (err)
                reject(err);
            else {
                resolve(results);
            }
        });
    });
}
exports.searchEstab = searchEstab;
