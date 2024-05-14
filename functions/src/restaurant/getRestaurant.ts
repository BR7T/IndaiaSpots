import { NextFunction } from "express";
import { QueryError } from "mysql2";

export function getRestaurant(mysqlCon : any, restaurantId : string) : Promise<JSON[]> {
    const getRestaurantQuery = 'select * from restaurante where id_restaurante = ?';
    return new Promise((resolve, reject) => {
        mysqlCon.query(getRestaurantQuery,[restaurantId], (err : QueryError | null,results : JSON[] | PromiseLike<JSON[]>) => {
            if(err) reject(err);
            resolve(results);
        })
    })
}

export function getAllRestaurants(mysqlCon : any , next : NextFunction) : Promise<Array<JSON>> {
    const getAllRestaurantQuery = 'select * from restaurante';
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
    const searchQuery : string = "select * from restaurantes where nome like CONCAT('%',?,'%') and approved=?";
    return new Promise((resolve,reject) => {
        mysqlCon.query(searchQuery,[keyword], (err : string,results : Array<JSON>) => {
            if(err) reject(err);
            resolve(results);
        })
    })
}

