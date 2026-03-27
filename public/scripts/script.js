// ===============================
// Task 2: Dynamic Product Rendering
// ===============================

class Product {
    constructor(id, name, price, image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
    }
}

const products = [
    new Product(1, "Gaming Mouse", 700, "assets/mouse.jpg"),
    new Product(2, "Tablet", 10000, "assets/tablet.jpg"),
    new Product(3, "Gaming Laptop", 15000, "assets/images/victus.png"),
    new Product(4, "Wireless Mouse", 900, "assets/mouse.jpg"),
    new Product(5, "Office Tablet", 8500, "assets/tablet.jpg"),
    new Product(6, "Laptop Pro", 22000, "assets/images/victus.png"),
    new Product(7, "RGB Mouse", 1200, "assets/mouse.jpg"),
    new Product(8, "Student Tablet", 9500, "assets/tablet.jpg"),
    new Product(9, "Portable Laptop", 18000, "assets/images/victus.png"),
    new Product(10, "Gaming Tablet", 13000, "assets/tablet.jpg")
];


const productGrid = document.querySelector(".product-grid");


if (productGrid) {

    products.forEach(function(product) {

        const article = document.createElement("article");
        article.classList.add("product-card");

        const img = document.createElement("img");
        img.setAttribute("src", product.image);
        img.setAttribute("alt", product.name);

        const bodyDiv = document.createElement("div");
        bodyDiv.classList.add("product-body");

        const title = document.createElement("h3");
        title.textContent = product.name;

        const price = document.createElement("p");
        price.classList.add("price");
        price.textContent = "$" + product.price;

        const actions = document.createElement("div");
        actions.classList.add("actions");

        const viewLink = document.createElement("a");
        viewLink.setAttribute("href", "detail.html");
        viewLink.textContent = "View Details";

        const button = document.createElement("button");
        button.setAttribute("type", "button");
        button.setAttribute("data-id", product.id);
        button.textContent = "Add to Cart";

        actions.appendChild(viewLink);
        actions.appendChild(button);

        bodyDiv.appendChild(title);
        bodyDiv.appendChild(price);
        bodyDiv.appendChild(actions);

        article.appendChild(img);
        article.appendChild(bodyDiv);

        productGrid.appendChild(article);
    });
}


// =======================
// TASK 3: Event Handling & The Cart 
// =======================

let cart = [];


document.body.addEventListener("click", function(event) {

    if (event.target.tagName === "BUTTON" && event.target.textContent === "Add to Cart") {

        const productId = event.target.getAttribute("data-id");

        const selectedProduct = products.find(function(product) {
            return product.id == productId;
        });

        if (!selectedProduct) return;

        const existingItem = cart.find(function(item) {
            return item.id == productId;
        });

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: selectedProduct.id,
                name: selectedProduct.name,
                price: selectedProduct.price,
                image: selectedProduct.image,
                quantity: 1
            });
        }

        renderCart();
    }
});



function renderCart() {

    const cartList = document.querySelector(".cart-list");
    const totalDisplay = document.getElementById("cart-total");

    if (!cartList) return;

    cartList.textContent = "";

    cart.forEach(function(item) {

        const li = document.createElement("li");

        const name = document.createElement("h3");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = "$" + item.price;

        const qtyInput = document.createElement("input");
        qtyInput.type = "number";
        qtyInput.value = item.quantity;
        qtyInput.min = 0;
        qtyInput.setAttribute("data-id", item.id);

        li.appendChild(name);
        li.appendChild(price);
        li.appendChild(qtyInput);

        cartList.appendChild(li);
    });

    const total = cart.reduce(function(sum, item) {
        return sum + (item.price * item.quantity);
    }, 0);

    if (totalDisplay) {
        totalDisplay.textContent = "$" + total;
    }
}



document.body.addEventListener("input", function(event) {

    if (event.target.type === "number") {

        const id = event.target.getAttribute("data-id");
        const value = parseInt(event.target.value);

        const item = cart.find(i => i.id == id);

        if (!item) return;

        if (value === 0) {
            cart = cart.filter(i => i.id != id);
        } else {
            item.quantity = value;
        }

        renderCart();
    }
});