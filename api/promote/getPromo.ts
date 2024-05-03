export async function getPromos(mysqlCon) : Promise<string | JSON[]> {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Promocoes";
      mysqlCon.query(query, (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
};

export async function getPromoById(mysqlCon, promoId, next) {
    const query = "SELECT * FROM Promocoes WHERE ID_Promocoes = ?";
    return new Promise((resolve, reject) => {
        mysqlCon.query(query, [promoId], (err, results) => {
            if (err) {
                next(err)
            } else {
                resolve(results[0]);
            }
        });
    });
}

