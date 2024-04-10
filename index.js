document.addEventListener("DOMContentLoaded", function() {
    fetchBooks()
    displayCart()
})

function fetchBooks() {
    fetch("https://striveschool-api.herokuapp.com/books")
    .then((response) => response.json())
    .then(displayBooks)
    .catch((error) => {
        console.error("Errore, libri non trovati:", error)
        displayError()
    })
}

function displayBooks(books) {
    const bookList = document.getElementById("book-list")
    books.forEach((book) => {
        const bookCard = createBookCard(book)
        bookList.appendChild(bookCard)
    })
}

function createBookCard(book) {
    const col = document.createElement("div")
    col.className = "col-lg-4 col-md-6 mb-4"
    col.innerHTML = `
        <div class="card h-100 d-flex flex-column">
            <img src="${book.img}" class="card-img-top" alt="Copertina di ${book.title}">
            <div class="card-body d-flex flex-column flex-grow-1">
                <h5 class="card-title">${book.title}</h5>
                <p class="card-text">${book.price}€</p>
                <button class="btn btn-danger mt-auto" onclick="removeCard(this)">Scarta</button>
                <button class="btn btn-success mt-2" onclick="addToCart('${book.asin}', '${book.title}', ${book.price})">Compra ora</button>
            </div>
        </div>
    `
    return col
}

function addToCart(asin, title, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []
    let found = cart.find(item => item.asin === asin)
    if (!found) {
        cart.push({ asin, title, price, quantity: 1 })
    } else {
        found.quantity++
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    displayCart()
}

function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    const cartList = document.getElementById("cart-list")
    cartList.innerHTML = ''
    cart.forEach(item => {
        let Moltiplica = item.quantity * item.price 
        const li = document.createElement("li")
        li.className = "list-group-item d-flex justify-content-between align-items-center"
        li.innerHTML = `
        <img src="${item.img}" class="img-fluid" style="width: 100px; height: auto; margin-right: 10px;" alt="Copertina di ${item.title}">
        <div class="flex-grow-1">
            <strong>${item.title}</strong> - Quantità Selezionata: ${item.quantity} x ${item.price}€ = Totale: ${Moltiplica}
        </div>
        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${item.asin}')">Rimuovi</button>
    `
        cartList.appendChild(li)
    })
}

function removeFromCart(asin) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []
    let newCart = cart.filter(item => item.asin !== asin)
    localStorage.setItem('cart', JSON.stringify(newCart))
    displayCart()
}

function removeCard(button) {
    button.closest(".col-lg-4").remove()
}

function displayError() {
    const bookList = document.getElementById("book-list")
    bookList.innerHTML = '<div class="alert alert-danger" role="alert">Impossibile caricare i libri. Si prega di riprovare più tardi.</div>'
}
