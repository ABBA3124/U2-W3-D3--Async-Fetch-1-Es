document.addEventListener("DOMContentLoaded", function () {
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
      clearCart()
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
  col.className = "col-lg-3 col-md-6 mb-4"
  col.innerHTML = `
        <div class="card h-100 d-flex flex-column">
            <img src="${book.img}" class="card-img-top" alt="Copertina di ${
    book.title
  }">
            <div class="card-body d-flex flex-column flex-grow-1">
                <h5 class="card-title">${book.title}</h5>
                <p class="card-text">${book.price.toFixed(2)}€</p>
                <button class="btn btn-danger mt-auto" onclick="removeCard(this)">Rimuovi</button>
                <button class="btn btn-success mt-2" onclick="addToCart('${
                  book.asin
                }', '${book.title}', ${book.price}, '${
    book.img
  }')">Compra ora</button></div></div>`
  return col
}

function addToCart(asin, title, price, img) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []
  let found = cart.find((item) => item.asin === asin)
  if (!found) {
    cart.push({ asin, title, price, img, quantity: 1 })
  } else {
    found.quantity++
  }
  localStorage.setItem("cart", JSON.stringify(cart))
  displayCart()
}

function displayCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const cartList = document.getElementById("cart-list")
  cartList.innerHTML = ""
  let totalCart = 0

  cart.forEach((item) => {
    let totalPrice = (item.quantity * item.price).toFixed(2)
    totalCart += parseFloat(totalPrice)

    const li = document.createElement("li")
    li.className =
      "list-group-item d-flex justify-content-between align-items-center p-3"
    li.innerHTML = `
            <img src="${
              item.img
            }" class="img-thumbnail" style="width: 60px; height: auto; margin-right: 20px;" alt="Copertina di ${
      item.title
    }">
            <div class="me-auto">
                <strong>${item.title}</strong> - <span>${item.price.toFixed(
      2
    )}€ / Unità</span>
            </div>
            <div>
                <button class="btn btn-outline-secondary btn-sm" onclick="changeQuantity('${
                  item.asin
                }', -1)">
                    <i class="bi bi-dash-lg"></i>
                </button>
                <span class="mx-2" style="min-width: 20px; text-align: center;">${
                  item.quantity
                }</span>
                <button class="btn btn-outline-secondary btn-sm" onclick="changeQuantity('${
                  item.asin
                }', 1)">
                    <i class="bi bi-plus-lg"></i>
                </button>
            </div>
            <span class="text-muted">Totale: ${totalPrice}€</span>
            <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart('${
              item.asin
            }')">
                <i class="bi bi-trash">Rimuovi</i>
            </button>
        `
    cartList.appendChild(li)
  })

  // TOTALE CARRELLO (CART)
  const totalElement = document.createElement("li")
  totalElement.className =
    "list-group-item d-flex justify-content-between align-items-center p-3"
  totalElement.innerHTML = `<strong>Totale Carrello:</strong> <span>${totalCart.toFixed(
    2
  )}€</span>`
  totalElement.style.fontSize = "1.2rem"
  cartList.appendChild(totalElement)


  //ultima aggiunta per far apparire il bottone che permette di svuotare il carrello
  const clearButton = document.createElement("button")
        clearButton.className = "btn btn-warning btn-lg"
        clearButton.textContent = "Svuota Carrello"
        clearButton.onclick = clearCart
        cartList.appendChild(clearButton)
}

function changeQuantity(asin, change) {
  let cart = JSON.parse(localStorage.getItem("cart"))
  let item = cart.find((item) => item.asin === asin)
  if (!item) return

  item.quantity += change
  if (item.quantity < 1) item.quantity = 1

  localStorage.setItem("cart", JSON.stringify(cart))
  displayCart()
}

function removeFromCart(asin) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []
  let newCart = cart.filter((item) => item.asin !== asin)
  localStorage.setItem("cart", JSON.stringify(newCart))
  displayCart()
}

function removeCard(button) {
  button.closest(".col-lg-3").remove()
}

function displayError() {
  const bookList = document.getElementById("book-list")
  bookList.innerHTML =
    '<div class="alert alert-danger" role="alert">Impossibile caricare la lista dei libri disponibili. Si prega di riprovare più tardi.</div>'
    

  localStorage.setItem("cart", JSON.stringify([]))
  displayCart()
}


// funzione svuota il carrerllo e aggiorna il carrello
function clearCart() {
    localStorage.setItem("cart", JSON.stringify([]))
    displayCart()
}
