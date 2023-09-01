function saidaenter(){
    let botao = document.getElementById('enter');
    botao.classList.add('nada')
}

const form = document.getElementById("formSignup");
const usernameInput = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", function() {
    setTimeout(function() {
        usernameInput.value = "";
        email.value = "";
        password.value = "";
    },500);
})
<<<<<<< HEAD
=======


>>>>>>> b7a96d91918c5e20807173da3bc05569463b3cee
