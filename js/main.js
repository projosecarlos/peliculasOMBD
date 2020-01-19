var blockedScrollBar = false;
var page = 1;

$(document).ready(() => { //
    $("#closeDescription").click(() => {
        $("#movieDetails").fadeOut();
    });

    //Función para recoger los data de la lista de películas de la búsqueda
    $("#search").click(function () {
        page = 1;
        $(".movies").remove();
        var keywords = $("#keywords").val();
        filterCheck(keywords);
    });

    //Función para hacer scroll infinito
    $(window).on('scroll', function () {
        var position = $(window).scrollTop();
        var bottom = $(document).height() - $(window).height();
        var keywords = $("#keywords").val();

        if ((position == bottom)) {
            blockedScrollBar = true;
            filterCheck(keywords);
        }
    });
});

function filterCheck(keywords) { //Comprueba si está buscando películas o series
    var a = $("#filter option:selected").val();
    if ((a == "Movies") || (a == undefined) && blockedScrollBar == false) {
        blockedScrollBar = true;
        $.ajax({
            url: "http://www.omdbapi.com/?s=" + keywords + "&page=" + page + "&type=movie&apikey=ffbf2dce", success: function (result) {
                $.each(result.Search, function (i, e) {
                    insertResult(e);
                }
                )
                page++;
            }
        })
    } else if (a == "Series") {
        scrollBarBloqueado = true;
        $.ajax({
            url: "http://www.omdbapi.com/?s=" + keywords + "&page=" + page + "&type=series&apikey=ffbf2dce", success: function (result) {
                $.each(result.Search, function (i, e) {
                    insertResult(e);
                }
                )
                page++;
            }
        })
    }
}

function imageChange() { //Cambiar imagen si el poster no carga
    $("img").on("error", function () {
        $(this).attr("src", "images/not-found.png");
    })
}

function insertResult(e) { //Inserta cada tarjeta según los datos que llegan del JSON
    let card = $("<div>");
    $(card).attr("class", "card col-md-3 col-xl-2 col-sm-6 offset-1 offset-md-0 movies");
    $(card).attr("style", "width: 18rem; height: 36rem");
    let image = $("<img>");
    $(image).on("error", () => {
        $(image).attr("src", "/images/not-found.png");
    });
    $(image).attr("class", "card-img-top");
    $(image).attr("style", "height: 24rem");
    $(image).attr("src", e.Poster);
    $(image).attr("alt", e.Title);
    $(card).append(image);

    //Card-Body
    let cardBody = $('<div>');
    $(cardBody).attr("class", "card-body");

    //Title
    let title = $('<h5>');
    $(title).attr("class", "card-title");
    $(title).html(e.Title);
    $(cardBody).append(title);

    //Year
    let year = $('<p>');
    $(year).attr("class", "card-text");
    $(year).html(e.Year);
    $(cardBody).append(year);

    //Button
    let button = $('<button>');
    button.movieID = e.imdbID;
    $(button).attr("class", "details btn btn-dark my-2 my-sm-0");
    $(button).html("Watch Details");
    $(cardBody).append(button);

    //Append
    $(card).append($(cardBody));
    $(".list").append(card);

    //Function
    $(button).click(() => {
        getDescription(button.movieID);
    })
}

function getDescription(movieID) { //Enlaza y prepara la consulta del detalle de la película
    $.getJSON("https://www.omdbapi.com/?i=" + movieID + "&apikey=ffbf2dce", (response) => {
        showDescription(response);
    });
}

function showDescription(data) { //Maqueta el detalle de la película segun la response que le llega
    $("#moviePoster, #movieTitle, .list-group-item").empty();
    let image = $("<img>");
    $(image).on("error", () => {
        $(image).attr("src", "./images/not-found.png");
    });
    $(image).attr("src", data.Poster);
    $("#moviePoster").append(image);
    $("#duration").append("<b>Duration: </b>" + data.Runtime);
    $("#genre").append("<b>Genre: </b>" + data.Genre);
    $("#released").append("<b>Released on: </b>" + data.Released);
    $("#country").append("<b>Country: </b>" + data.Country);
    $("#rating").append("<b>IMDB Rating: </b>" + data.imdbRating);
    $("#movieTitle").append(data.Title);
    $("#movieDescription").append("<b>Description: </b>" + data.Plot);
    $("#year").append("<b>Year: </b>" + data.Year);
    $("#actors").append("<b>Actors: </b>" + data.Actors);
    $("#movieDetails").fadeIn();
}