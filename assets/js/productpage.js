// Fetch data
function getData(asin) {
    fetch(`https://striveschool-api.herokuapp.com/books/${asin}`)
        .then((response) => response.json())
        .then(book => createProductCard(book))
}


// <!-- PRODUCT-->

// <!-- PRODUCT-METHODS -->

const createProductCard = (book) => {
    document.querySelector("h2").innerHTML = book.title
    document.querySelector(".product .row").innerHTML =
        `<div class="card w-100">
        <img src="${book.img}" class="card-img-top" alt="..." style="max-width:300px">
        <div class="card-body">
            <h5 class="card-title">${book.category.slice(0,1).toUpperCase() + book.category.slice(1)}</h5>
            <p class="card-text">Price:"$" ${book.price}</p>
            <a href="#" class="btn btn-primary" onclick="window.history.go(-1); return false;">Go Back</a>
        </div>
    </div>`
}


window.onload = () => {
    getData(sessionStorage.getItem('asin'))

}