import { QueryError } from "mysql2";
import { RestaurantData } from "../types/restaurantData";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

export function addRestaurant(mysqlCon : Connection,restaurantData : any) : Promise<QueryError | void> {
    const insertQuery = 'insert into Restaurante(nome,horario_atendimento,dia_atendimento,tipo_cozinha,icone,ID_Usuario) values(?,?,?,?,?,?)';
    return new Promise((resolve,reject) => {
        mysqlCon.query(insertQuery,[
            restaurantData.Nome,
            restaurantData.Horas,
            restaurantData.Dias,
            restaurantData.Tipo,
            restaurantData.Icone,
            restaurantData.restaurantId
        ], (err : QueryError | null,results : any) => {
                if(err) reject(err)
            })
    })
}

export function populateRestaurantDataObject(data : any) {
    const restaurantData : RestaurantData =  {
        nome: data.body.nome,
        contato: data.body.contato,
        horario_atendimento: data.body.horario,
        dia_atendimento: data.body.diaAtendimento,
        tipo_cozinha: data.body.tipoCozinha,
        icone : data.body.icone
    }
    return restaurantData;
}

export function completeRegister(mysqlCon : Connection,restaurantData : any) {
    
}

