"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRestaurant = void 0;
function updateRestaurant(mysqlCon, restaurantId, updatedData) {
    const updateQuery = "UPDATE restaurante SET nome=?, contato=?, horario_atendimento=?, dia_atendimento=?, tipo_cozinha=?, CNPJ=? WHERE id_restaurante=?";
    return new Promise((resolve, reject) => {
        mysqlCon.query(updateQuery, [
            updatedData.nome,
            updatedData.contato,
            updatedData.horario_atendimento,
            updatedData.dia_atendimento,
            updatedData.tipo_cozinha,
            restaurantId
        ], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve('success');
        });
    });
}
exports.updateRestaurant = updateRestaurant;
