"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRestaurant = void 0;
function addRestaurant(mysqlCon, restaurantData) {
    const insertQuery = 'insert into restaurante(nome,contato,horario_atendimento,dia_atendimento,tipo_cozinha) values(?,?,?,?,?)';
    return new Promise((resolve, reject) => {
        mysqlCon.query(insertQuery, [restaurantData.nome, restaurantData.contato, restaurantData.horario_atendimento, restaurantData.dia_atendimento, restaurantData.tipo_cozinha], (err, results) => { });
    });
}
exports.addRestaurant = addRestaurant;
