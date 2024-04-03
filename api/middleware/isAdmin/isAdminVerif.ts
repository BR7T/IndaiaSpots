const isAdmin = (req, res, next) => {
    console.log('Verificando permissões de administração...');
    if (req.user && req.user.isAdmin === 1) {
        console.log('Usuário é administrador, permitindo acesso.');
        next();
    } else {
        console.log('Acesso negado para usuário não administrador.');
        res.status(403).send('Acesso negado');
    }
};

module.exports = isAdmin;