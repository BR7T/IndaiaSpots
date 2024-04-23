import { upload } from "../middleware/multer/ImageUpload";
import { RestaurantData } from "../types/restaurantData";

export function addRestaurant(mysqlCon,restaurantData) : Promise<void> {
    const insertQuery = 'insert into restaurante(nome,contato,horario_atendimento,dia_atendimento,tipo_cozinha) values(?,?,?,?,?)';
    return new Promise((resolve,reject) => {
        upload(restaurantData.image);
        mysqlCon.query(insertQuery,[restaurantData.nome,restaurantData.contato,restaurantData.horario_atendimento,restaurantData.dia_atendimento,restaurantData.tipo_cozinha], (err,results) => {})
    })
}

export function populateRestaurantDataObject(data) {
    const restaurantData : RestaurantData =  {
        nome : data.body.nome,
        contato : data.body.contato,
        horario_atendimento : data.body.horario,
        dia_atendimento : data.body.diaAtendimento,
        tipo_cozinha : data.body.tipoCozinha
    }
    return restaurantData;
}