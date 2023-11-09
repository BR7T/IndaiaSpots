const form = document.getElementById('form');
const ename = document.getElementById('name');
const imageUrl = document.getElementById('imageUrl');
const description = document.getElementById('description');


async function addNewCard() {
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
        document.body.appendChild(successElement); 
    });
}

form.addEventListener('submit', async function(event) {
    event.preventDefault();
    await addNewCard();
})

