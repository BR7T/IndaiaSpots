module.exports = {
    getEstab(mysqlCon, estabId) {
        const getEstabQuery = 'select * from establishments where id_establishments = ?';
        mysqlCon.query(getEstabQuery,[estabId], (err : string,results : Array<JSON>) => {
            if(results.length == 0) {
                throw Error('establishment with that id not found');
            }
            else {
                return results;
            }
        })
    },
    getAllEstabs(mysqlCon) {
        const getEstabQuery = 'select * from establishments';
        
        return new Promise((resolve, reject) => {
            mysqlCon.query(getEstabQuery, (err : string, results : Array<any>) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
}
