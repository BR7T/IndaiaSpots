const express = require('express');
const port = 3080;
const app = express();
const mysql = require('mysql2');
const path = require('path');

app.engine('html', require('ejs').renderFile);
app.use(express.json());       
app.use(express.urlencoded({     
  extended: true
}));
app.use(express.static(path.join(__dirname, '/public')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.set('view engine', 'ejs');
app.set('views', './views');

const con = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "MyJoaol",
    database : "IndaiaSpots"
});

function mySqlConnection() {
    con.connect(function(err) {
        console.log("Connection to database Successful");
    });
}

mySqlConnection();

function mySqlQueryInsert(mySqlquery,data) {
    const query = mySqlquery;
    const values = [data];
    con.query(query,values,function(err,result) {
        if(err) {throw err}
        console.log("Query Successful");
    });
}

app.get('/checkUser', function(req,res) {
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM user", function (err, result, fields) {
          if (err) throw err;
          console.log(result);
        });
    })
});



app.post('/login', function(req,res) {
    const userLogin = {
        email : req.body.email,
        password : req.body.password
    }
    con.query(
        `select * from user where email="${userLogin.email}" and password="${userLogin.password}";`
        , (err,results) =>{
            if(err) throw err;
            if(results.length > 0) {
                console.log("Exists in the database");
                res.sendFile("index.html", {root: __dirname });
            }
            else {
                //res.sendFile("login.html", {root : __dirname});  
                res.render(__dirname + "/public/views/login.ejs", {error:"Usuário ou senha inválidos"});  
                
            }
        });
});


app.post('/signup', (req,res) => {
    const user = [req.body.email,req.body.username,req.body.password];
    res.status(204).send();
    mySqlQueryInsert("insert into user (email,userName,password) values(?)",user);
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));