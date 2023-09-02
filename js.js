function saidaenter(){
    let botao = document.getElementById('enter');
    botao.classList.add('nada')
}

const form = document.getElementById("formSignup");
const usernameInput = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", async function(event) {
    setTimeout(function() {
        usernameInput.value = "";
        email.value = "";
        password.value = "";
    },500);
});


async function formErrorMessage() {
    config = {
        method : "POST",
        headers: {"Content-type": "application/json"},
        body : JSON.stringify({
            email : "sdcsdcsb@gmail.com",
            password : "dkfbcdf",
            authentication : true
        })
    }
    await fetch("http://localhost:3070/login", config).then(res => {
        const data = res.json();
        if(data.authentication === false) {
            document.write("Senha inválida");
        }
    })
    
    
}

