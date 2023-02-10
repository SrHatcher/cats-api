const API_URL_RANDOM= 'https://api.thecatapi.com/v1/images/search?limit=2&api_key=live_ekv2pdbNUc8evOuW8yaD00AhCwMkQWv9KUgtjr2LeLkfXBLYFLUvmkfmirq8BZ8a'
const API_URL_FAVOURITE = 'https://api.thecatapi.com/v1/favourites?limit=1000'
const API_URL_DELETE_FAVORITE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`
const api_key='live_ekv2pdbNUc8evOuW8yaD00AhCwMkQWv9KUgtjr2LeLkfXBLYFLUvmkfmirq8BZ8a'
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload'
const button = document.getElementById('boton')
const spanError = document.getElementById('error')

button.addEventListener('click', async ()=>{
    loadRandomMichis()
})


async function loadRandomMichis(){
    const Response = await fetch(API_URL_RANDOM)
    const data = await Response.json()

    if(Response.status !== 200){
        spanError.innerHTML="hubo un error: " + Response.status
    }else{
        const img = document.getElementById('img1')
        const img2 = document.getElementById('img2')
        const btn1 = document.getElementById('btn1')
        const btn2 = document.getElementById('btn2')
        img.src=data[0].url
        img2.src=data[1].url

        btn1.onclick= ()=>saveFavorites(data[0].id)
        btn2.onclick= ()=>saveFavorites(data[1].id)

        console.log('random cats',data);
    }
}

async function loadFavoritesMichis(){
    const res = await fetch(API_URL_FAVOURITE, {headers: {"x-api-key": api_key}})
    
    if(res.status !== 200){
        const error = await res.text()
        spanError.innerHTML="hubo un error: " + error
    }else{
        const data = await res.json()
        console.log('favorite cats',data)

        const section = document.getElementById('michisFavoritos')
        const titulo = document.createElement('h2')
        titulo.innerText='Michis favoritos'
        section.innerHTML=''
        section.appendChild(titulo)

        data.forEach(michi => {
            const article = document.createElement('article')
            const img = document.createElement('img')
            const btn = document.createElement('button')
            const btnText = document.createTextNode('sacar al michi de favoritos')

            btn.appendChild(btnText)
            btn.onclick = () => deleteFavoriteMichi(michi.id)
            img.src=michi.image.url
            img.width=300

            article.appendChild(img)
            article.appendChild(btn)
            section.appendChild(article)
        })
    }

}

async function saveFavorites(id){
    const res = await fetch(API_URL_FAVOURITE, {
        method: 'POST',
        headers: {
            'Content-Type':'Application/json',
            'x-api-key': api_key
        },
        body: JSON.stringify({
            "image_id": id
        })
    })

    if(res.status !==200){
        const error = await res.text()
        spanError.innerHTML = "ocurrio un error: " + error
    }else{
        const data = await res.json();
        console.log('respuesta guardar fav',data)
        loadFavoritesMichis()
    }

}

async function deleteFavoriteMichi(id){
    const res = await fetch(API_URL_DELETE_FAVORITE(id), {
        method: 'DElETE',
        headers: {
            "x-api-key": api_key
        }
    })

    if(res.status !==200){
        const error = await res.text()
        spanError.innerHTML = "ocurrio un error: " + error
    }else{
        const data = await res.json();
        console.log('delete', data)
        loadFavoritesMichis()
    }
}

async function uploadMichiPhoto(){
    const form = document.getElementById('uploadingForm')
    const formData = new FormData(form)

    console.log(formData.get('file'));

    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            'x-api-key': api_key,
        },
        body: formData
    })

    if(res.status!==201){
        const data = await res.text()
        spanError.innerHTML = 'hubo un error al subir el michi: ' + data
    }else{
        console.log("foto de michi subida con exito!");
        const data = await res.json()
        console.log(data)
    }
}

const previewImage = ()=>{
    const file = document.getElementById("file").files;
    console.log(file)
    if(file.length > 0){
        const fileReader = new FileReader()
        fileReader.onload= function(e){
            document.getElementById('preview').setAttribute('src', e.target.result)
        }
        fileReader.readAsDataURL(file[0])
    }
}

loadRandomMichis()
loadFavoritesMichis()
