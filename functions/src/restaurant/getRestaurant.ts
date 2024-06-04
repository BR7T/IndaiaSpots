import { NextFunction } from "express";
import { QueryError } from "mysql2";

export function getRestaurant(mysqlCon : any, restaurantId : string) : Promise<JSON[]> {
    const getRestaurantQuery = 'select r.Nome, r.ID_Restaurante ,r.Dia_Atendimento, r.Horario_Atendimento, r.icone,r.Tipo_Cozinha, e.Bairro, e.Rua, e.Numero, i.Url from Restaurante r inner join Imagem i on r.ID_Usuario = i.ID_Restaurante inner join Endereco e on r.ID_Usuario = e.ID_Restaurante where r.ID_Restaurante=?';
    return new Promise((resolve, reject) => {
        mysqlCon.query(getRestaurantQuery,[restaurantId], (err : QueryError | null,results : JSON[] | PromiseLike<JSON[]>) => {
            if(err) reject(err);
            resolve(results);
        })
    })
}

export function getAllRestaurants(mysqlCon : any , next : NextFunction) : Promise<Array<JSON>> {
    const getAllRestaurantQuery = 'select r.Nome,r.ID_Restaurante ,r.Dia_Atendimento, r.Horario_Atendimento, r.icone, r.Tipo_Cozinha, e.Bairro, e.Rua, e.Numero, i.Url from Restaurante r inner join Imagem i on r.ID_Usuario = i.ID_Restaurante inner join Endereco e on r.ID_Usuario = e.ID_Restaurante';
    return new Promise((resolve, reject) => {
        mysqlCon.query(getAllRestaurantQuery, (err : string, results : Array<any>) => {
            if (err) {
                next(err);
            }
            resolve(results);
        });
    });
}

export function searchRestaurant(mysqlCon : any,keyword : string) : Promise<Array<JSON>> {
    const searchQuery : string = "select * from Restaurante  where nome like CONCAT('%',?,'%')";
    return new Promise((resolve,reject) => {
        mysqlCon.query(searchQuery,[keyword], (err : string,results : Array<JSON>) => {
            if(err) reject(err);
            resolve(results);
        })
    })
}

