

/*let boxImage = ['https://media-cdn.tripadvisor.com/media/photo-s/17/dc/56/1a/pezao-bar.jpg', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-ZVnVGIgWPPAHP3gD87Lx5K5KQWRp-nAgfQ&usqp=CAU','https://media-cdn.tripadvisor.com/media/photo-s/07/c6/e8/6f/tinhos-restaurante.jpg','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLV6TTp088dTG4-lltk63MNQv5GiWdMsW6PA&usqp=CAU']
let boxNome = ['Pezão','Caipirão', "Tinho's" , 'Bar do Bode', 'Duckbill', 'mcdonalds', 'Burger King','Mister Texas']
let boxText = ['Linguica','Caipiras com frango']*/

let boxNome = [];
let boxImage = [];
let boxText = [];

function teste(){
    boxarea = document.getElementById('box-area')
    for(let i=0; boxNome.length > i;i++){
        
        let geral = document.createElement('article')
        let top = document.createElement('div')
        let bottom = document.createElement('div')
        let h1 = document.createElement('h1')
        let text = document.createElement('p')

        
        document.body.appendChild(text)
        document.body.appendChild(h1)
        document.body.appendChild(top)
        document.body.appendChild(bottom)
        document.body.appendChild(geral)

        boxarea.appendChild(geral)
        
        geral.appendChild(top)
        geral.appendChild(bottom)
        bottom.appendChild(h1);bottom.appendChild(text)

        geral.classList.add('geral')
        
        top.classList.add('top')
        bottom.classList.add('bottom')
        h1.innerHTML = boxNome[i]
        text.innerHTML = boxText[i]
        top.style.backgroundImage=`url(${boxImage[i]})`
        top.style.backgroundPosition=`center`
        top.style.backgroundSize='cover'
    }
}

window.onload = async function(){
    await getEstabs();
    teste();
}

async function getEstabs() {
    const response = await fetch('http://localhost:3100/estab');
    const results = await response.json();
    for(let i = 0; i < results.length; i++) {
        const data = {
            estabName : results[i].name,
            image : results[i].imageUrl,
            description : results[i].description
        }
        boxImage[i] = [data.image]
        boxNome[i] = [data.estabName]
        boxText[i] = [data.description]
    }
}