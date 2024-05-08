import { QueryError } from "mysql2";
import { RestaurantData } from "../types/restaurantData";

export function addRestaurant(mysqlCon,restaurantData) : Promise<QueryError | void> {
    const insertQuery = 'insert into restaurante(nome,contato,horario_atendimento,dia_atendimento,tipo_cozinha,CNPJ) values(?,?,?,?,?,?)';
    return new Promise((resolve,reject) => {
        mysqlCon.query(insertQuery,[
            restaurantData.nome,
            restaurantData.contato,
            restaurantData.horario_atendimento,
            restaurantData.dia_atendimento,
            restaurantData.tipo_cozinha,
            restaurantData.CNPJ,
        ], (err,results) => {
                if(err) reject(err)
            })
    })
}

export function addImage(mySqlConnection, filename) : Promise<QueryError | string> {
    const url = `https://d1rz3fbu8zmjz5.cloudfront.net/${filename}`;
    const insertQuery = 'insert into imagem(url) values (?)';
    return new Promise((resolve, reject) => {
        mySqlConnection.query(insertQuery,[url], (err, results) => {
            if(err) reject(err);
            else {
                resolve('success');
            }
        })
    })
}

export function populateRestaurantDataObject(data) {
    const restaurantData : RestaurantData =  {
        nome: data.body.nome,
        contato: data.body.contato,
        horario_atendimento: data.body.horario,
        dia_atendimento: data.body.diaAtendimento,
        tipo_cozinha: data.body.tipoCozinha,
        CNPJ: data.body.CNPJ
    }
    return restaurantData;
}

