const form = document.getElementById('form');
const ename = document.getElementById('name');
const imageUrl = document.getElementById('imageUrl');
const description = document.getElementById('description');


async function postData() {
    const data = JSON.stringify({
        name : ename.value,
        imageUrl : imageUrl.value,
        description : description.value
    })
    
    await fetch('http://localhost:3100/addEstab', {
        method : 'POST',
        body : data, 
        mode: 'cors',
        cache: 'default',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(response => {
        successElement = document.createElement('p');
        successElement.innerHTML = response.message;
        if(response.query == false) {
            successElement.classList.add('failMessage');
            document.body.appendChild(successElement);
        }
        else {
            successElement.classList.add('successMessage');
            document.body.appendChild(successElement);
            form.reset();
        }
    });
}

form.addEventListener('submit', async function(event) {
    event.preventDefault();
    await postData();
})

function formMessage() {
    successElement = document.createElement('p');
    successElement.innerHTML = response.message;
    successElement.classList.add('successMessage');
    document.body.appendChild(successElement);
    form.reset();
}

