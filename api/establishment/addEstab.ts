export function addEstab(mysqlCon,estabData) : Promise<void> {
    const insertQuery = 'insert into establishments(name,imageUrl,description) values(?,?,?)';
    return new Promise((resolve,reject) => {
        mysqlCon.query(insertQuery,[estabData.estabName,estabData.imageUrl,estabData.description], (err,results) => {})
    })
}