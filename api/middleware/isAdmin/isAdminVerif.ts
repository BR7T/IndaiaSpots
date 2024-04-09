import { Request, Response } from "express";

const isAdmin = (req: Request, res: Response, next) => {
    console.log('Verificando permissões de administração...');
    if (userId && req.user.Administrador === 1) {
        console.log('Usuário é administrador, permitindo acesso.');
        next();
    } else {
        console.log('Acesso negado para usuário não administrador.');
        res.status(403).send('Acesso negado');
    }
};

module.exports = isAdmin;