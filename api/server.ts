//Express
const express = require('express');
import { Request, Response } from "express";
const path = require('path');
const port = 3100;
const app = express();
//mySQL
const mysqlCon = require('./middleware/db/mysql.js');
const getEstab = require('./establishment/getEstab.js');
const addEstab = require('./establishment/addEstab.js');
const addUser = require('./user/addUser.js');
const getUser = require('./user/getUser.js');

//bcrypt
const hashing = require('./middleware/bcrypt/hashing.js');

//firebase
const firebase = require('./firebase/auth.js');

app.use(express.static(path.join('C:/VScode projects/IndaiaSpots/IndaiaSpots', 'public')));
app.use(express.json());       
app.use(express.urlencoded({     
  extended: true
}));

app.use(function (req : Request, res : any, next : any) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const mySqlConnection : any = mysqlCon.newConnection();
const domainUrl = 'http://localhost:3100';

//Page serving
function pageRoutes(routesArray : Array<any>) {
    for(let i = 0; i < routesArray.length; i++) {
        app.get(`/${routesArray[i].routeName}`, (req : Request,res : Response) => {
            res.sendFile(path.join('C:/VScode projects/IndaiaSpots/IndaiaSpots', 'public', routesArray[i].fileName));
        })
    }
}

let routes = {
    pages : [
        {routeName : 'login', fileName : 'loginAndSignup.html'},
        {routeName : 'home', fileName : 'home.html'},
        {routeName : 'addEstabs', fileName : 'addEstab.html'},
        {routeName : 'emailVerification', fileName : 'emailVerification.html'}
    ]
}
pageRoutes(routes['pages']);

type userData  = {
    username : string,
    email : string,
    password : string
}

type estabData = {
    estabName : string,
    imageUrl : string,
    description : string
}

app.get('/', async function(req : Request,res : Response) {
    res.redirect('/login');
})

app.post('/userSignin', async function(req : Request,res : Response) {
    const userData : userData = {
        username : "",
        email : req.body.email,
        password : req.body.password
    }
 
    const homeUrl = `${domainUrl}/home`;
    const checkEmailQuery =  'select * from user where email=?';
    mySqlConnection.query(checkEmailQuery,[userData.email], (err : string,results : any) => {
        if(err) throw err;
        if(results.length > 0) {
            let isEqual = hashing.compare(req.body.password, results[0].password);
            if(isEqual) {
                res.send({credentials : true, redirect : homeUrl});
            }
            else {
            res.send({credentials : false,errorMessage: "Email ou senha inválidos"});
            }
        }
    });
})

app.post('/checkUserExist', function(req : Request,res : Response) {
    const userData : userData = {
        username : req.body.username,
        email : req.body.email,
        password : ""
    }
    
    getUser.checkIfUserExists(mySqlConnection,userData).then(result => {
        if(result) res.send({exists : true})
        else {
            res.send({exists : false})
        }
    })
})

app.post('/userSignup', async function(req : Request, res : Response) {
    if(req.body.password.length < 8 ) {
        res.send({error : 'Tamanho da senha inválido'});
        return;
    }
    
    let message : string | null = null;
    let hashedPassword : string = await hashing.hashPassword(req.body.password,12);
    
    const userData : userData = {
        username : req.body.username,
        email : req.body.email,
        password : hashedPassword
    }

    const signupCheckQuery =  'select * from user where userName=? or email=?;select * from user where email=?';
    mySqlConnection.query(signupCheckQuery,[userData.username,userData.email], (err : string,results : Array<any>) => {
        if(err) {console.log(err)}
        else if(results[0].length > 0) {
            message  = "Nome de usuário já está em uso";
        }
        else if(results[1].length > 0) {
            message = 'email já está em uso'
        }
        if(message) {
            res.send({errorMessage : message, credentials : false});
        }
        else if(message == null) {
            addUser.addNewUser(mySqlConnection,userData);
            res.send({credentials : true, errorMessage : "Cadastro Concluído"});
        }
    });
})

app.get('/getEstabs', function(req : Request,res : Response) {     
    getEstab.getAllEstabs(mySqlConnection).then(results => {
        res.send(results);
    })
})

app.post('/addEstab', async function(req : Request,res : Response) {
    const data : estabData =  {
        estabName : req.body.name,
        imageUrl : req.body.imageUrl,
        description : req.body.description
    }
    addEstab.addEstab(mySqlConnection,data);
})

app.post('/searchEstab', function(req :Request ,res : Response) {
    const keyword : string = req.body.keyword;
    getEstab.searchEstab(mySqlConnection,keyword).then(results => {
        res.send(results);
    })
})

app.post('/googleSignIn', function(req : Request,res :Response) {
    const userData : userData = {
        username : req.body.username,
        email : req.body.email,
        password : ""
    }

    const googleUserInsertQuery = 'insert into user(username,email,authentication_type) values(?,?,"google")';    
    const isValidGoogleToken = firebase.checkGoogleToken(req.body.token).then(function() {
        if(isValidGoogleToken.error_description == "Invalid Value") {
            throw Error('token invalid');
        }
        else if(req.body.isNewUser) {
            mySqlConnection.query(googleUserInsertQuery,[userData.username,userData.email], (err : string,results : any) => {})
        }
        res.redirect(`${domainUrl}/home`);
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

