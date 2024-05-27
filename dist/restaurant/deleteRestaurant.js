"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRestaurant = void 0;
function deleteRestaurant(mysqlCon, restaurantId) {
    const deleteQuery = "DELETE FROM restaurante WHERE id_restaurante=?";
    return new Promise((resolve, reject) => {
        mysqlCon.query(deleteQuery, [restaurantId], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve('success');
        });
    });
}
exports.deleteRestaurant = deleteRestaurant;
