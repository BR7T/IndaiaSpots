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

export function searchRestaurant(mysqlCon : any ,next : NextFunction, keyword : string) : Promise<Array<JSON>> {
    const searchQuery : string = "SELECT r.Nome,r.ID_Restaurante,r.Dia_Atendimento,r.Horario_Atendimento,r.icone,r.Tipo_Cozinha,e.Bairro,e.Rua,e.Numero,i.Url, CASE WHEN r.Nome LIKE ? THEN 1 WHEN r.Tipo_Cozinha LIKE ? THEN 2 END AS Ordem FROM Restaurante r INNER JOIN Imagem i ON r.ID_Usuario = i.ID_Restaurante INNER JOIN Endereco e ON r.ID_Usuario = e.ID_Restaurante WHERE r.Nome LIKE ? OR r.Tipo_Cozinha LIKE ? ORDER BY Ordem, r.Nome";
    keyword = '%' + keyword + '%';
    return new Promise((resolve,reject) => {
        mysqlCon.query(searchQuery,[keyword,keyword,keyword,keyword], (err : string,results : Array<JSON>) => {
            if(err) {
                console.log(err)
                next(err);
            }
            resolve(results);
        })
    })
}

