var giphyApiUrl = 'https://api.giphy.com/v1/gifs';
var giphyApiKey = 'bnQuOLQVdCVPkdz1sXdeUdSmUpcEz5lg';
var giphyApiParameters = '&rating=&lang=en';
//arrreglo vacío
var totalGifs = [];
var slideIndex = 1;

function searchBar(event) {
    var searchText = document.getElementById('searchText').value;
    if (event.charCode == 13) {
        var urlFull = giphyApiUrl + '/search?api_key=' + giphyApiKey + '&q=' + searchText
        console.log(urlFull)
        getSearchApi(searchText);
        prepareSuggs();

    } else {
        var suggestWord = giphyApiUrl + '/search/tags?api_key=' + giphyApiKey + '&q=' + searchText + '&limit=5'
        console.log(suggestWord)
        fetch(suggestWord)
            .then((resp) => resp.json())
            .then(function(response) {
                console.log(response)
                printSuggest(response['data']);
            })
    }

}

function printWordSearch(wordsSearch) {
    var lastTwo = wordsSearch.substr(wordsSearch.length - 2);
    if (lastTwo == ", ") {
        wordsSearch = wordsSearch.replace(', ', '')
    }
    var searchRes = document.getElementById('wordSearch');
    searchRes.textContent = wordsSearch;
    var input = document.getElementById('searchText');
    input.value = wordsSearch;
}

/*Función para no repetir funciones*/
function getSearchApi(searchText) {
    var urlFull = giphyApiUrl + '/search?api_key=' + giphyApiKey + '&q=' + searchText
    fetch(urlFull)
        .then((resp) => resp.json())
        .then(function(response) {
            var container2 = document.getElementById('container2');
            var children = container2.childNodes;
            printWordSearch(searchText);
            console.log(response['data'].length)
            if (response['data'].length < 1) {
                printNoResults();
            } else if (children.length >= 2) {
                updateGifs(response['data']);
            } else {
                printGifs(response['data']);
            }
        })
}

function printNoResults(resultNone) {
    /*document.getElementById('container2').classList.add('container2noRes')*/
    let elements = document.getElementsByName('imgGif'),
        index
    console.log(elements.length)

    for (index = elements.length - 1; index >= 0; index--) {
        elements[index].remove()
    }
    document.getElementById('container2').className = "container2noRes";
    // if doesnt exist
    if (document.getElementById('imgResultNone') == null) {
        var imgNoRes = document.createElement("img");
        imgNoRes.id = "imgResultNone";
        imgNoRes.src = "assets/icon-busqueda-sin-resultado.svg";
        let txtNoRes = document.createElement("h3");
        txtNoRes.id = "txtResultNone";
        txtNoRes.textContent = "Intenta con otra búsqueda.";
        document.getElementById('container2').appendChild(imgNoRes);
        document.getElementById('container2').appendChild(txtNoRes);
    }
}


window.onload = function trendingParg(trendingWord) {
    var trendingUrl = 'https://api.giphy.com/v1' + '/trending/searches?api_key=' + giphyApiKey
    fetch(trendingUrl)
        .then((resp) => resp.json())
        .then(function(response) {
            printTrending(response['data']);
        })
}

function printTrending(trendingText) {
    for (let i = 0; i < 5; i++) {
        var trendingWord = document.createElement('a');
        trendingWord.addEventListener("click", clickTrending);
        if (i != 4) {
            trendingWord.innerHTML = trendingText[i] + ", ";
        } else {
            trendingWord.innerHTML = trendingText[i];
        }
        document.getElementById('trendingTxt').appendChild(trendingWord);
    }

}

function clickTrending(event) {
    var trendingValue = event.target.firstChild.data;
    getSearchApi(trendingValue);

}

function prepareGifsList() {
    try {
        document.getElementById('imgResultNone').remove();
        document.getElementById('txtResultNone').remove();
        document.getElementById('container2').className = "container2";
    } catch (error) {
        console.log(error)
    }

}

function printGifs(gifs) {
    prepareGifsList();
    for (let i = 0; i < 12; i++) {
        var img = document.createElement('img');
        img.src = gifs[i]['images']['downsized']['url'];
        img.id = "imgGif".concat(i);

        totalGifs[i] = gifs[i];

        //img.tagName = "imgGif";
        /*img.classList.add('containerImg');*/
        var divOverlay = document.createElement('div');
        divOverlay.className = "overlayGif";

        var maxButton = document.createElement("button");
        maxButton.className = "max-button";
        maxButton.id = "max-button";

        var downButton = document.createElement("button");
        downButton.className = "download-button";
        downButton.id = "down-button";
        downButton.onclick = function() {
            (async() => {
                let a = document.createElement('a');
                let response = await fetch(gifs[i]['images']['downsized']['url']);
                let file = await response.blob();
                a.download = gifs[i]['title'];
                a.href = window.URL.createObjectURL(file);
                a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
                a.click();
            })();
        }

        var favButton = document.createElement("button");
        favButton.className = "fav-button";
        favButton.id = "fav-button";
        favButton.onclick = function() {
            saveFavGifs(i)
        }

        var descriptionImg = document.createElement('div');
        descriptionImg.className = "descriptionImg";

        let htmlTitulo = document.createElement('p');
        htmlTitulo.id = "tituloGif".concat(i);
        let htmlTitulo1 = gifs[i]['title'];
        htmlTitulo.className = "htmlTitulo";
        htmlTitulo.textContent = htmlTitulo1;

        let htmlUsuario = document.createElement('p');
        htmlUsuario.id = "usuarioGif".concat(i);
        let htmlUsuario1 = gifs[i]['username'];
        htmlUsuario.textContent = htmlUsuario1;
        htmlUsuario.className = "htmlUsuario";


        var divImg = document.createElement('div');
        divImg.id = "divGifCont";
        divImg.className = "divGifCont";


        divImg.appendChild(divOverlay);
        divImg.appendChild(img);
        divOverlay.appendChild(descriptionImg);
        divOverlay.appendChild(maxButton);
        divOverlay.appendChild(downButton);
        divOverlay.appendChild(favButton);
        divOverlay.appendChild(htmlTitulo);
        divOverlay.appendChild(htmlUsuario);

        document.getElementById('container2').appendChild(divImg);
    }
}

function saveFavGifs(indexGifArray) {
    // En el localStorage siempre se guardan los datos como cadenas de caracteres.
    var saveGifsFav = localStorage.getItem('gifsFav');
    console.log(saveGifsFav)
    if (saveGifsFav === null) {
        saveGifsFav = [];
    } else {
        // JSON.parse => Convertir cadenas de caracteres a arreglos.
        saveGifsFav = JSON.parse(saveGifsFav);
        // Despues de que ya sea arreglo, añadimos el GIF a favoritos.
    }
    saveGifsFav.push(totalGifs[indexGifArray])
        // JSON.strinfigy => Convertir arreglos a cadenas de caracteres.
    localStorage.setItem('gifsFav', JSON.stringify(saveGifsFav));
}

function printFavGif() {
    var favoriteGifs = localStorage.getItem('gifsFav').JSON.parse();
}

function updateGifs(printGifs) {
    prepareGifsList();

    for (let i = 11; i >= 0; i--) {

        let imgGifId = document.getElementById('imgGif'.concat(i));
        let titGifId = document.getElementById('tituloGif'.concat(i));
        let userGifId = document.getElementById('usuarioGif'.concat(i));
        imgGifId.src = printGifs[i]['images']['downsized']['url'];
        titGifId.textContent = printGifs[i]['title'];
        userGifId.textContent = printGifs[i]['username'];

        totalGifs[i] = printGifs[i];

    }
}

/* function printSuggest(suggWord) {
    var list = document.getElementById('suggestList');
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    };
    suggWord.forEach(item => {
        var option = document.createElement('a');
        console.log(option)
        option.values = item['name'];
        list.appendChild(option);
    });
} */

function printSuggest(pData) {
    prepareSuggs();
    let listSug = document.createElement("div");
    listSug.id = 'listSug';
    listSug.className = 'listSug';
    for (let i = 0; i < pData.length; i++) {
        let listWordSug = document.createElement('div')
        listWordSug.id = "listWordSug";
        listWordSug.className = "listWordSug"
        listWordSug.innerHTML += pData[i]['name'];
        listWordSug.innerHTML += "<input type='hidden' value='" + pData[i]['name'] + "'>";
        listWordSug.addEventListener("click", function(event) {
            searchText.value = this.getElementsByTagName("input")[0].value;
        });

        listSug.appendChild(listWordSug);

    }
    let divInp = document.getElementById('divInput');
    divInp.appendChild(listSug);
}

function prepareSuggs() {
    try {
        document.getElementById('listSug').remove();
        document.getElementById('listWordSug').remove();
    } catch (error) {
        console.log(error);
    }

}

showSlides(slideIndex);
fillSlides();

function fillSlides() {
    var trendingUrl = 'https://api.giphy.com/v1/gifs/trending?' + 'api_key=' + giphyApiKey + '&limit=9&offset=0' + giphyApiParameters
    console.log(trendingUrl)
    fetch(trendingUrl)
        .then((resp) => resp.json())
        .then(function(response) {
            var images = document.getElementsByClassName("trendingImg");
            for (i = 0; i < images.length; i++) {
                console.log(response)
                images[i].src = response['data'][i]['images']['downsized']['url'];
                console.log(response)
            }

        })

}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function creategifo(params) {
    let btnStart = document.getElementById("comenzar");
    let btnRecorder = document.getElementById("grabar");
    let btnEnd = document.getElementById('finalizar');
    let btnSubmit = document.getElementById('subir')

}

function hideBtn() {
    document.getElementById('comenzar').style.display = 'none';
    document.getElementById('texto1').innerHTML = "¿Nos das acceso" + "<br />" + "a tu cámara?";
    document.getElementById('texto2').innerHTML = "El acceso a tu camara será válido sólo" + " <br / > " + "por el tiempo en el que estés creando el GIFO.";
    document.getElementById('num1').className = "num1";

}

function grabarBtn() {


}