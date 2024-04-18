export function addRestaurant(mysqlCon,restaurantData) : Promise<void> {
    console.log("Restaurant Data : " + restaurantData)
    const insertQuery = 'insert into restaurante(nome,contato,horario_atendimento,dia_atendimento,tipo_cozinha,CNPJ) values(?,?,?,?,?,?)';
    return new Promise((resolve,reject) => {
        mysqlCon.query(insertQuery,[
            restaurantData.nome,
            restaurantData.contato,
            restaurantData.horario_atendimento,
            restaurantData.dia_atendimento,
            restaurantData.tipo_cozinha,
            restaurantData.CNPJ,
        ],
             (err,results) => {
                if(err){
                    reject(err)
                }else{
                    resolve(results)
                }
             })
    })
}