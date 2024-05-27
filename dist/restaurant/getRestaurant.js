"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRestaurant = exports.getAllRestaurants = exports.getRestaurant = void 0;
function getRestaurant(mysqlCon, restaurantId) {
    const getRestaurantQuery = 'select * from Restaurante where ID_Restaurante = ?';
    return new Promise((resolve, reject) => {
        mysqlCon.query(getRestaurantQuery, [restaurantId], (err, results) => {
            if (err)
                reject(err);
            resolve(results);
        });
    });
}
exports.getRestaurant = getRestaurant;
function getAllRestaurants(mysqlCon, next) {
    const getAllRestaurantQuery = 'select * from Restaurante ';
    return new Promise((resolve, reject) => {
        mysqlCon.query(getAllRestaurantQuery, (err, results) => {
            if (err) {
                next(err);
            }
            resolve(results);
        });
    });
}
exports.getAllRestaurants = getAllRestaurants;
function searchRestaurant(mysqlCon, keyword) {
    const searchQuery = "select * from Restaurante  where nome like CONCAT('%',?,'%')";
    return new Promise((resolve, reject) => {
        mysqlCon.query(searchQuery, [keyword], (err, results) => {
            if (err)
                reject(err);
            resolve(results);
        });
    });
}
exports.searchRestaurant = searchRestaurant;
