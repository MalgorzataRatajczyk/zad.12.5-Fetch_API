"use strict"

var prefix = "https://cors-anywhere.herokuapp.com/";
// zmienne z adresami URL — pierwszy do wysyłania tweetów, drugi do pobierania cytatów
var tweetLink = "https://twitter.com/intent/tweet?text=";
var quoteUrl = "https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1";
var button = document.querySelector('.trigger');

// funkcja do pobierania losowych cytatów za pomocą API
function getQuote() {

    button.disabled = true;

    fetch(prefix + quoteUrl, { cache: "no-store" })
        .then(function(resp) {

            return resp.json();

        })

        .then(createTweet);

}
// funckaj która tworzy linki z tweetami i podpina je pod przycisk do tweetowania 
function createTweet(input) {

    var data = input[0];
    // sprawdzenie autora cytatu
    var dataElement = document.createElement('div');
    dataElement.innerHTML = data.content;
    var quoteText = dataElement.innerText.trim();
    var quoteAuthor = data.title;

    if (!quoteAuthor.length) {
        quoteAuthor = "Unknown author";
    }
    // wygenerowanie treści tweeta
    var tweetText = "Quote of the day - " + quoteText + " Author: " + quoteAuthor;
    // sparwdzenie długości tweeta
    if (tweetText.length > 140) { //jeśli wykraczamy poza 140 symboli, tweet zostanie jeszcze raz wygenerowany
        getQuote();

    } else { //jeśli długość tweeta jest prawidłowa, pokazujemy cytat użytkownikowi i podpinamy pod link, który zajmie się generowaniem tweeta 
        button.disabled = false;
        var tweet = tweetLink + encodeURIComponent(tweetText); //zmienna tweet to złożenie dwóch elementów: linka do generowania nowych tweetów oraz samego tekstu tweeta
        document.querySelector('.quote').innerText = quoteText; //element, w którym wyświetlamy treść naszego cytatu
        document.querySelector('.author').innerText = "Author: " + quoteAuthor; //element, w którym pokazujemy autora cytatu
        document.querySelector('.tweet').setAttribute('href', tweet); //wybieramy element z klasą .tweet i modyfikujemy zawartość atrybutu href na URL tweeta, który trzymany jest w zmiennej tweet
    
    }

}
// funkcja która po załadowaniu strony generuje cytat i podpina go na element o klasie .trigger (nasłuchiwanie na zdarzenie kliknięcia), po którym ma się wykonać funkcja generująca cytat
document.addEventListener('DOMContentLoaded', function() {

    getQuote();

    button.addEventListener('click', function() {
        
        getQuote();

    });

});