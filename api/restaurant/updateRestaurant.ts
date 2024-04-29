import { RestaurantData } from "../types/restaurantData";

export function updateRestaurant(mysqlCon, restaurantId: number, updatedData: RestaurantData): Promise<void> {
    const updateQuery = 'UPDATE restaurante SET nome=?, contato=?, horario_atendimento=?, dia_atendimento=?, tipo_cozinha=?, CNPJ=? WHERE id_restaurante=?';
    
    return new Promise((resolve, reject) => {
        mysqlCon.query(updateQuery, [
            updatedData.nome,
            updatedData.contato,
            updatedData.horario_atendimento,
            updatedData.dia_atendimento,
            updatedData.tipo_cozinha,
            updatedData.CNPJ,
            restaurantId
        ], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}


export function deleteRestaurant(mysqlCon, restaurantId: number): Promise<void> {
    const deleteQuery = 'DELETE FROM restaurante WHERE id_restaurante=?';
    return new Promise((resolve, reject) => {
        mysqlCon.query(deleteQuery, [restaurantId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}
