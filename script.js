let products = [];
let cart = [];
let discount = 0;

fetch("products.json")
    .then(response => response.json())
    .then(data => {
        products = data;
        showProducts();
    });

function showProducts() {
    let html = "";
    for (let product of products) {
        html += `
            <div class="product">
                <img src="${product.image}">
                <h3>${product.name}</h3>
                <p>₹${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
    }
    document.getElementById("products").innerHTML = html;
}

function addToCart(id) {
    let item = cart.find(product => product.id == id);

    if (item) {
        item.quantity++;
    } else {
        let product = products.find(product => product.id == id);
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    showCart();
}

function showCart() {
    let html = "";

    for (let item of cart) {
        html += `
            <div class="cartItem">
                ${item.name} - ₹${item.price}<br>
                Quantity:
                <button onclick="decrease(${item.id})">-</button>
                ${item.quantity}
                <button onclick="increase(${item.id})">+</button>
                <button onclick="removeItem(${item.id})">Remove</button>
            </div>
        `;
    }

    document.getElementById("cart").innerHTML = html;
    calculateTotal();
}

function increase(id) {
    let item = cart.find(product => product.id == id);
    item.quantity++;
    showCart();
}

function decrease(id) {
    let item = cart.find(product => product.id == id);
    if (item.quantity > 1) {
        item.quantity--;
    }
    showCart();
}

function removeItem(id) {
    cart = cart.filter(product => product.id != id);
    showCart();
}

function calculateTotal() {
    let subtotal = 0;

    for (let item of cart) {
        subtotal += item.price * item.quantity;
    }

    let discountAmount = subtotal * discount;
    let priceAfterDiscount = subtotal - discountAmount;
    let tax = priceAfterDiscount * 0.05;
    let total = priceAfterDiscount + tax;

    document.getElementById("subtotal").innerText = subtotal;
    document.getElementById("tax").innerText = tax.toFixed(2);
    document.getElementById("total").innerText = total.toFixed(2);
}

function applyPromo() {
    let code = document.getElementById("promo").value;

    if (code == "SAVE20") {
        discount = 0.20;
        document.getElementById("discount").innerText = "20% discount applied!";
    } else {
        discount = 0;
        document.getElementById("discount").innerText = "Invalid promo code";
    }

    calculateTotal();
}

function showCheckout() {
    if (cart.length == 0) {
        alert("Cart is empty!");
        return;
    }
    document.getElementById("checkout").style.display = "block";
}

function step2() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;

    if (name == "") {
        alert("Enter your name");
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        document.getElementById("emailError").innerText = "Enter a valid email";
        return;
    }

    document.getElementById("emailError").innerText = "";
    document.getElementById("payment").style.display = "block";
}

function placeOrder() {
    let card = document.getElementById("card").value;

    if (card.length != 16 || isNaN(card)) {
        document.getElementById("cardError").innerText =
            "Enter a valid 16 digit card number";
        return;
    }

    document.getElementById("cardError").innerText = "";
    alert("Order placed successfully!");

    cart = [];
    discount = 0;
    showCart();
}