import { QueryError } from "mysql2";
import { mySqlConnection } from "../middleware/db/mysql";
import express, {Router, Request, Response} from 'express';

const adminRouter : Router = express.Router();


adminRouter.put('/admin/set-admin/:userId', async function(req: Request, res: Response) {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(403).send('Acesso negado');
    }

    try {
        const updateQuery = 'UPDATE usuario SET Administrador = 1 WHERE id = ?';
        await mySqlConnection.query(updateQuery, [userId], (err : QueryError | null, results : any)  => {
            if(results.length == 0) {
                
            }
        })
    

        res.send('Usuário definido como administrador com sucesso');
    } catch (error) {
        console.error('Erro ao definir usuário como administrador:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

const Administrador = require('../middleware/isAdmin/isAdminVerif');
adminRouter.put('/admin/set-admin/:userId', Administrador, async function(req, res) {
});

export {adminRouter};