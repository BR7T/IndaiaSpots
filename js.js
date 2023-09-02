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
<<<<<<< HEAD
})
=======
});


>>>>>>> 11b7b6fe0e35fb69b01419d8cdb0252039bf3770
