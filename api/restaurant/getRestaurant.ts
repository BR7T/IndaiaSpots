export function getRestaurant(mysqlCon, restaurantId) {
    const getRestaurantQuery = 'select * from restaurante where id_restaurante = ?';
    return new Promise((resolve, reject) => {
        mysqlCon.query(getRestaurantQuery,[restaurantId], (err : string,results : Array<JSON>) => {
            if(err) reject(err)
            else {
                resolve(results);
            }
        })
    })
}

export function getAllRestaurants(mysqlCon) : Promise<Array<JSON>> {
    const getAllRestaurantQuery = 'select * from restaurante';
    return new Promise((resolve, reject) => {
        mysqlCon.query(getAllRestaurantQuery, (err : string, results : Array<any>) => {
            if (err) reject(err);
            else {
                resolve(results);
            }
        });
    });
}

export function searchEstab(mysqlCon,keyword) : Promise<Array<JSON>> {
    const searchQuery : string = "select * from restaurantes where nome like CONCAT('%',?,'%') and approved=?";
    const isApproved = true;
    return new Promise((resolve,reject) => {
        mysqlCon.query(searchQuery,[keyword,isApproved], (err : string,results : Array<JSON>) => {
            if(err) reject(err);
            else {
                resolve(results);
            }
        })
    })
}

