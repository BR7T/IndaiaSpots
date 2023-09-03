const form = document.getElementById('formLogin');
const email = document.getElementById('email');
const password = document.getElementById('password');

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    fetch('http://localhost:3080/login', {
        method : 'POST',
        body : JSON.stringify({
            email : email.value,
            password : password.value
        }), 
        mode: 'cors',
        cache: 'default',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
    })
    .then(response => response.json()).then(response => {
        console.log(response);
        if(response.message == "true" ) {
            window.location.href = "../public/index.html";
        }
        else{
            document.getElementById('errorMessage').innerHTML = response.message;
        }
    })
    
})