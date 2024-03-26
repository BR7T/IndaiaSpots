export function getEstab(mysqlCon, estabId) {
    const getEstabQuery = 'select * from establishments where id_establishments = ?';
    return new Promise((resolve, reject) => {
        mysqlCon.query(getEstabQuery,[estabId], (err : string,results : Array<JSON>) => {
            if(err) reject(err)
            else {
                resolve(results);
            }
        })
    })
}

export function getAllEstabs(mysqlCon) : Promise<Array<JSON>> {
    const getEstabQuery = 'select * from establishments where approved=?';
    const isApproved = true; 
    return new Promise((resolve, reject) => {
        mysqlCon.query(getEstabQuery,[isApproved], (err : string, results : Array<any>) => {
            if (err) reject(err);
            else {
                resolve(results);
            }
        });
    });
}

export function searchEstab(mysqlCon,keyword) : Promise<Array<JSON>> {
    const searchQuery : string = "select * from establishments where name like CONCAT('%',?,'%')";
    return new Promise((resolve,reject) => {
        mysqlCon.query(searchQuery,[keyword], (err : string,results : Array<JSON>) => {
            if(err) reject(err);
            else {
                resolve(results);
            }
        })
    })
}

