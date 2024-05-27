"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRating = void 0;
function addRating(mysqlCon, data) {
    const ratingQuery = 'insert into avaliacoes(id_restaurante,id_usuario,quantidade) values(?,?,?)';
    mysqlCon.query(ratingQuery, [data.restaurantId, data.userId, data.quantity], (err, results) => {
        if (err)
            throw err;
    });
}
exports.addRating = addRating;
