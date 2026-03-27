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

class CartItem {
    constructor(product, quantity) {
        this.id = product.id;
        this.name = product.name;
        this.price = product.price;
        this.image = product.image;
        this.quantity = quantity;
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

const currentUser = {
    name: "Jona",
    orderHistory: [
        {
            orderNumber: "0928586",
            date: "Feb 15, 2024",
            total: "$49.99",
            items: ["4Tech Mouse", "RGB, Wireless, Black", "Qty: 1", "Status: Delivered"]
        },
        {
            orderNumber: "1032471",
            date: "Mar 03, 2024",
            total: "$15,000.00",
            items: ["Victus Laptop", "16GB RAM, 512GB SSD", "Qty: 1", "Status: Shipped"]
        }
    ]
};


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
            cart.push(new CartItem(selectedProduct, 1));
        }

        const productCard = event.target.closest(".product-card");

        if (productCard) {
            productCard.classList.add("fade-in");

            setTimeout(function() {
                productCard.classList.remove("fade-in");
            }, 700);
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

// =======================
// Task 4: Form Validation & Submission (checkout.html)
// =======================

const paymentForm = document.querySelector("#paymentForm");

if (paymentForm) {
    const fullNameInput = document.querySelector("#fullName");
    const streetInput = document.querySelector("#street");
    const zipInput = document.querySelector("#zip");
    const cardNumberInput = document.querySelector("#cardNumber");
    const expiryInput = document.querySelector("#expiry");
    const cvvInput = document.querySelector("#cvv");

    function getErrorElement(input) {
        let errorElement = input.parentElement.querySelector(".error-message");

        if (!errorElement) {
            errorElement = document.createElement("small");
            errorElement.classList.add("error-message");
            input.parentElement.appendChild(errorElement);
        }

        return errorElement;
    }

    function showError(input, message) {
        input.classList.add("error");
        getErrorElement(input).textContent = message;
    }

    function clearError(input) {
        input.classList.remove("error");
        getErrorElement(input).textContent = "";
    }

    paymentForm.addEventListener("submit", function(event) {
        event.preventDefault();

        let isValid = true;
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');

        clearError(fullNameInput);
        clearError(streetInput);
        clearError(zipInput);
        clearError(cardNumberInput);
        clearError(expiryInput);
        clearError(cvvInput);

        if (fullNameInput.value.trim() === "") {
            showError(fullNameInput, "Full name is required.");
            isValid = false;
        }

        if (streetInput.value.trim() === "") {
            showError(streetInput, "Street address is required.");
            isValid = false;
        }

        if (zipInput.value.trim() === "") {
            showError(zipInput, "Zip code is required.");
            isValid = false;
        }

        if (paymentMethod && paymentMethod.value === "card") {
            if (cardNumberInput.value.trim() === "") {
                showError(cardNumberInput, "Card number is required.");
                isValid = false;
            }

            if (expiryInput.value.trim() === "") {
                showError(expiryInput, "Expiry date is required.");
                isValid = false;
            }

            if (cvvInput.value.trim() === "") {
                showError(cvvInput, "CVV is required.");
                isValid = false;
            }
        }

        if (isValid) {
            console.log("Form submitted successfully.");
            window.location.href = "thankyou.html";
        }
    });
}

// =======================
// Task 5: User Account & Order History (account.html)
// =======================

const accountGreeting = document.querySelector("#accountGreeting");
const accountName = document.querySelector("#accountName");
const orderSummaries = document.querySelectorAll(".order-list summary");

if (accountGreeting && accountName) {
    accountGreeting.textContent = currentUser.name + "'s Account";
    accountName.textContent = currentUser.name;
}

orderSummaries.forEach(function(summary) {
    summary.addEventListener("click", function() {
        const details = summary.parentElement;
        const detailsContent = details.querySelector(".order-details");
        const orderIndex = details.getAttribute("data-order-index");
        const order = currentUser.orderHistory[orderIndex];

        if (!order || detailsContent.getAttribute("data-loaded") === "true") {
            return;
        }

        let itemsMarkup = "";

        order.items.forEach(function(item) {
            itemsMarkup += "<li>" + item + "</li>";
        });

        detailsContent.innerHTML =
            "<p>Date: " + order.date + "</p>" +
            "<p>Total: " + order.total + "</p>" +
            "<p>Items:</p>" +
            "<ul>" + itemsMarkup + "</ul>";

        detailsContent.setAttribute("data-loaded", "true");
    });
});
