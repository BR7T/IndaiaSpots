import { QueryError } from "mysql2";

export function addAddress(mysqlCon, data) {
    const adressQuery = 'insert into endereco(id_restaurante,tipo,logradouro,bairro,complemento, numero, cep) values(?,?,?,?,?,?,?)';
    mysqlCon.query(adressQuery, [data.id_restaurante, data.logradouro,data.bairro,data.complemento, data.numero, data.cep], (err : QueryError | null, results : any)  => {})
}