const express = require('express');
const port = 3060;
const app = express();

app.use(express.json());       
app.use(express.urlencoded({     
  extended: true
}));

app.get('authUser', function(req,res) {
    
})

app.post('/login', function(req,res) {
    const userLogin = {
        email : req.body.email,
        password : req.body.password
    }
    res.send("index.html");
});


app.post('/signup', (req,res) => {
    const user = {
        username : req.body.username,
        email : req.body.email,
        password : req.body.password
    }
    res.status(204).send();
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));