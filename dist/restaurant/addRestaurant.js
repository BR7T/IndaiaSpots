"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeRegister = exports.populateRestaurantDataObject = exports.addRestaurant = void 0;
function addRestaurant(mysqlCon, restaurantData) {
    const insertQuery = 'insert into restaurante(nome,contato,horario_atendimento,dia_atendimento,tipo_cozinha,icone) values(?,?,?,?,?)';
    return new Promise((resolve, reject) => {
        mysqlCon.query(insertQuery, [
            restaurantData.nome,
            restaurantData.contato,
            restaurantData.horario_atendimento,
            restaurantData.dia_atendimento,
            restaurantData.tipo_cozinha,
        ], (err, results) => {
            if (err)
                reject(err);
        });
    });
}
exports.addRestaurant = addRestaurant;
function populateRestaurantDataObject(data) {
    const restaurantData = {
        nome: data.body.nome,
        contato: data.body.contato,
        horario_atendimento: data.body.horario,
        dia_atendimento: data.body.diaAtendimento,
        tipo_cozinha: data.body.tipoCozinha,
        icone: data.body.icone
    };
    return restaurantData;
}
exports.populateRestaurantDataObject = populateRestaurantDataObject;
function completeRegister(mysqlCon, restaurantData) {
}
exports.completeRegister = completeRegister;
