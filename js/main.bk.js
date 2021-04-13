var giphyApiUrl = 'https://api.giphy.com/v1/gifs';
var giphyApiKey = 'bnQuOLQVdCVPkdz1sXdeUdSmUpcEz5lg';
var giphyApiParameters = '&rating=&lang=en';

function searchBar(event) {
    var searchText = document.getElementById('searchText').value;
    if (event.charCode == 13) {
        var urlFull = giphyApiUrl + '/search?api_key=' + giphyApiKey + '&q=' + searchText
        getSearchApi(searchText);

    }
    var suggestWord = giphyApiUrl + '/search/tags?api_key=' + giphyApiKey + '&q=' + searchText + '&limit=5'
    fetch(suggestWord)
        .then((resp) => resp.json())
        .then(function(response) {
            printSuggest(response['data']);
        })
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

    }

}

function printGifs(gifs) {
    prepareGifsList();
    for (let i = 0; i < 12; i++) {
        var img = document.createElement('img');
        img.src = gifs[i]['images']['downsized']['url'];
        img.setAttribute("name", "imgGif");
        //img.tagName = "imgGif";
        /*img.classList.add('containerImg');*/
        document.getElementById('container2').appendChild(img);
    }
}

function updateGifs(printGifs) {
    prepareGifsList();
    var container2 = document.getElementById('container2');
    //print no results option a 
    if (container2.hasChildNodes()) {
        var children = container2.childNodes;

        for (let i = 0; i < children.length; i++) {
            var child = children[i];
            child.src = printGifs[i]['images']['downsized']['url'];
        }

    }
}

function printSuggest(suggWord) {
    var list = document.getElementById('suggestList');
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    };
    suggWord.forEach(item => {
        var option = document.createElement('option');
        option.value = item['name'];
        list.appendChild(option);
    });
}