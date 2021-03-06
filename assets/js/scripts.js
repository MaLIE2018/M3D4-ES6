let books = []
const booklist = document.querySelector('.booklist')
const basket = document.querySelector('.basket')
const searchfield = document.querySelector('.search')


// Fetch data
function getData() {
    fetch("https://striveschool-api.herokuapp.com/books")
        .then((response) => response.json())
        .then(data => {
            books = data
            createList(books)
        })
        .catch(err => showAlert("alert-danger", "Error", err.message))
}

// <!-- NAVIGATION -->

const goToProductpage = (asin) => {
    sessionStorage.setItem('asin', asin);
    window.location.href = 'productpage.html'
}

// <!-- ALERTS -->
const showAlert = (type, header, message) => {
    const alertContainer = document.querySelector('.alert-container')
    alertContainer.innerHTML =
        `<div class="alert ${type} position-absolute alert-dismissible" role="alert" style="z-index: 1;top: 57px;">
            <h4 class="alert-heading">${header}</h4>
            <hr>
            <p class="alert-result mb-0 mr-3">${message}</p>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>`
}

// <!-- BOOKLIST -->

// <!-- BOOKLIST-METHODS -->
// create the list wiht books
function createList(books) {
    books.forEach(book => {
        booklist.querySelector(".row").innerHTML +=
            ` <div class="col-md-4 mt-2">
            <a href="#" onclick="goToProductpage('${book.asin}')">
                <div class="card" id="${book.asin}">
                <img class="card-img-top img-fluid" src="${book.img}" alt="Card image cap">
                <div class="card-body">
                    <h6 class="card-title">${book.title}</h6>
                    <p class="card-text">Price: $${book.price}</p>
                    <div class="d-flex justify-content-end">
                        <a href="#" class="btn btn-success" onclick="addToCart(this)">Add to cart</a>
                        <a href="#" class="btn btn-secondary" onclick="deleteBookfromList(this)">Skip</a>
                    </div>
                </div>
            </a>
        </div>
      </div>`
    })

}
// Delete the item from list
const deleteBookfromList = (book) => {
    book.closest(".card").parentElement.remove()
}

// Search the book list
const searchBooks = (event) => {
    event.preventDefault()
    let filteredBooks = []
    const query = searchfield.value
    if (query.length >= 3) {
        filteredBooks = books.filter(book => book.title.toLowerCase().includes(query.toLowerCase()))
        booklist.querySelector(".row").innerHTML = ""
        createList(filteredBooks)
        filteredBooks = []
    } else if (query.length === 0) {
        booklist.querySelector(".row").innerHTML = ""
        createList(books)
    }

}

// <!-- BASKET -->

// <!-- BASKET-METHODS -->

// add items to the cart
const addToCart = (button) => {
    const card = button.closest(".card")
    const bookAsin = card.id
    const book = books.find(book => book.asin === bookAsin)
    basket.querySelector(".basket-list").innerHTML =
        `<li class="list-group-item">
            <div class="row d-flex align-items-center">
                <div class="col-2"><img src="${book.img}" alt="" style="width:50px"></div>
                <div class="col-6"><h6>${book.title}</h6></div>
                <div class="col-1"><h6 class="price text-right">$${book.price}</h6></div>
                <div class="col-3 d-flex"><button class="btn btn-danger ml-auto" onclick="deleteBookfromCart(this)"><ion-icon name="trash-bin-outline"></ion-icon></button></div>
            </div>
        </li>` + basket.querySelector(".basket-list").innerHTML
    booklist.querySelector(".row").removeChild(card.parentElement)

    showBatchCartIndicator()
    totalChart()
}

//Control batch
const showBatchCartIndicator = () => {
    const basketButton = document.querySelector('.basketButton')
    if (basketButton.querySelector(".badge") === null && basket.querySelector(".basket-list").children.length > 1) {
        document.querySelector(".basketButton").innerHTML +=
            `<span class="badge badge-danger rounded-circle position-absolute mt-1" style="z-index:1;top:-12px"><ion-icon name="information-circle-outline"></ion-icon></span>`
    } else if (basket.querySelectorAll(".basket-list li:not(.basket-total)").length < 1) {
        document.querySelector(".badge").remove()
    }
}

// Delete Item from the Basket
const deleteBookfromCart = (book) => {
    book.closest("li").remove()
    totalChart()
    showBatchCartIndicator()
}

// Empty the list
const emptyBasket = () => {
    [...basket.querySelectorAll(".basket-list li:not(.basket-total)")].map((ele) => ele.remove())
    totalChart()
    showBatchCartIndicator()
}

// Total
const totalChart = () => {
    const prices = basket.querySelectorAll(".price")
    console.log('prices:', prices)
    if (prices.length !== 0) {
        if (prices.length === 1) {
            console.log('document.querySelector(".total").innerHTML:', document.querySelector(".total").innerText)
            document.querySelector(".total").innerHTML = prices[0].innerHTML
        } else {
            document.querySelector(".total").innerHTML = "$" + ([...prices].reduce((acc, curr) => {
                acc += parseFloat(curr.innerHTML.slice(1))
                console.log(acc);
                return acc
            }, 0.0)).toFixed(2)
        }
    } else {
        document.querySelector(".total").innerHTML = "$0.00"
    }


}

// <!-- WINDOW-->

// <!-- WINDOW-METHODS -->

// Populate the book list on load
window.onload = () => {
    getData()
}