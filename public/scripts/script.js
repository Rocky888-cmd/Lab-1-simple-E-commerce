// ===============================
// TASK 2: Dynamic Product Rendering
// ===============================

// Product class used to structure each product's data
class Product {
    constructor(id, name, price, image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
    }
}

// Array of products (serves as temporary data source)
const products = [
    new Product(1, "Gaming Mouse", 700, "assets/mouse.jpg"),
    new Product(2, "Tablet", 10000, "assets/tablet.jpg"),
    new Product(3, "Gaming Laptop", 15000, "assets/victus.jpg"),
    new Product(4, "Charger", 900, "assets/charger1.jpg"),
    new Product(5, "Nintendo", 8500, "assets/nintendo.jpg"),
    new Product(6, "Airpods", 22000, "assets/airpod.jpg"),
    new Product(7, "iPhone", 1200, "assets/iphone.jpg"),
    new Product(8, "Powerbank", 9500, "assets/powerbank.jpg"),
    new Product(9, "Bluewow", 18000, "assets/bluewow.jpg"),
    new Product(10, "Smart Watch", 13000, "assets/smart_watch.jpg")
];

// Select the container where products will be displayed
const productContainer = document.querySelector(".product-grid");

// Only run this section if we are on the products page
if (productContainer) {

    // Loop through products and dynamically create product cards
    products.forEach(function (product) {

        // Create elements and structure the product card
        const productCard = document.createElement("article");
        productCard.classList.add("product-card");

        const productImage = document.createElement("img");
        productImage.src = product.image;
        productImage.alt = product.name;

        const productBody = document.createElement("div");
        productBody.classList.add("product-body");

        const productTitle = document.createElement("h3");
        productTitle.textContent = product.name;

        const productPrice = document.createElement("p");
        productPrice.classList.add("price");
        productPrice.textContent = "$" + product.price;

        const actionContainer = document.createElement("div");
        actionContainer.classList.add("actions");

        // Add-to-cart button stores product id using data-id
        const addToCartButton = document.createElement("button");
        addToCartButton.textContent = "Add to Cart";
        addToCartButton.setAttribute("data-id", product.id);

        actionContainer.appendChild(addToCartButton);
        productBody.appendChild(productTitle);
        productBody.appendChild(productPrice);
        productBody.appendChild(actionContainer);

        productCard.appendChild(productImage);
        productCard.appendChild(productBody);

        productContainer.appendChild(productCard);
    });
}


// =======================
// TASK 3: Event Handling & Cart Logic
// =======================

// Cart array stores selected items
let cart = [];

/*
Event Delegation:
Instead of adding a click listener to every button,
we add ONE listener to the body and detect which button was clicked.
*/
document.body.addEventListener("click", function (event) {

    if (event.target.tagName === "BUTTON" && event.target.textContent === "Add to Cart") {

        const productId = event.target.getAttribute("data-id");

        // Find the selected product using its ID
        const selectedProduct = products.find(function (product) {
            return product.id == productId;
        });

        if (!selectedProduct) return;

        // If product already exists in cart, increase quantity
        const existingItem = cart.find(item => item.id == productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...selectedProduct,
                quantity: 1
            });
        }

        renderCart();
    }
});


/*
renderCart():
This function clears the current cart display and rebuilds it
based on the cart array. This ensures UI always matches data.
*/
function renderCart() {

    const cartList = document.querySelector(".cart-list");
    const totalDisplay = document.getElementById("cart-total");

    if (!cartList) return;

    cartList.textContent = "";

    // Rebuild cart items dynamically
    cart.forEach(function (item) {

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

    /*
    reduce():
    Used to calculate total price by summing
    (price × quantity) of each item in cart.
    */
    const total = cart.reduce(function (sum, item) {
        return sum + (item.price * item.quantity);
    }, 0);

    if (totalDisplay) {
        totalDisplay.textContent = "$" + total;
    }
}


/*
Quantity Adjustment:
When user changes quantity input:
- Update the cart array
- Remove item if quantity becomes 0
- Re-render cart
*/
document.body.addEventListener("input", function (event) {

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

// Select the payment form
const paymentForm = document.querySelector("#paymentForm");

if (paymentForm) {

    // Get all required input fields
    const fullNameInput = document.querySelector("#fullName");
    const streetInput = document.querySelector("#street");
    const zipInput = document.querySelector("#zip");
    const cardNumberInput = document.querySelector("#cardNumber");
    const expiryInput = document.querySelector("#expiry");
    const cvvInput = document.querySelector("#cvv");

    // ----------------------------------
    // Function: Get or create error message element
    // ----------------------------------
    // Checks if an error message already exists beside the input.
    // If not, it creates a <small> element for displaying errors.
    function getErrorElement(input) {
        let errorElement = input.parentElement.querySelector(".error-message");

        if (!errorElement) {
            errorElement = document.createElement("small");
            errorElement.classList.add("error-message");
            input.parentElement.appendChild(errorElement);
        }

        return errorElement;
    }

    // ----------------------------------
    // Function: Display validation error
    // ----------------------------------
    // Adds error styling and shows message under the input field.
    function showError(input, message) {
        input.classList.add("error");
        getErrorElement(input).textContent = message;
    }

    // ----------------------------------
    // Function: Clear validation error
    // ----------------------------------
    // Removes error styling and clears message.
    function clearError(input) {
        input.classList.remove("error");
        getErrorElement(input).textContent = "";
    }

    // ----------------------------------
    // Form Submission Event
    // ----------------------------------
    paymentForm.addEventListener("submit", function(event) {

        // Prevent default form submission
        event.preventDefault();

        let isValid = true;

        // Get selected payment method (card or other)
        const paymentMethod =
            document.querySelector('input[name="paymentMethod"]:checked');

        // Clear previous validation errors
        clearError(fullNameInput);
        clearError(streetInput);
        clearError(zipInput);
        clearError(cardNumberInput);
        clearError(expiryInput);
        clearError(cvvInput);

        // -------- Required Field Validation --------

        // Validate Full Name
        if (fullNameInput.value.trim() === "") {
            showError(fullNameInput, "Full name is required.");
            isValid = false;
        }

        // Validate Street Address
        if (streetInput.value.trim() === "") {
            showError(streetInput, "Street address is required.");
            isValid = false;
        }

        // Validate Zip Code
        if (zipInput.value.trim() === "") {
            showError(zipInput, "Zip code is required.");
            isValid = false;
        }

        // -------- Conditional Card Validation --------
        // Only validate card fields if payment method is "card"
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

        // -------- Successful Validation --------
        // Redirect user when all inputs are valid
        if (isValid) {
            console.log("Form submitted successfully.");
            window.location.href = "thankyou.html";
        }
    });
}


// =======================
// Task 5: User Account & Order History (account.html)
// =======================

// Select account page elements
const accountGreeting = document.querySelector("#accountGreeting");
const accountName = document.querySelector("#accountName");
const orderSummaries = document.querySelectorAll(".order-list summary");

// ----------------------------------
// Display Logged-in User Information
// ----------------------------------
if (accountGreeting && accountName) {
    // Update greeting and username using currentUser object
    accountGreeting.textContent = currentUser.name + "'s Account";
    accountName.textContent = currentUser.name;
}


// ----------------------------------
// Order History Expand Logic
// ----------------------------------
// Loads order details only when user clicks the summary.
orderSummaries.forEach(function(summary) {

    summary.addEventListener("click", function() {

        const details = summary.parentElement;
        const detailsContent = details.querySelector(".order-details");

        // Get order index stored in HTML attribute
        const orderIndex = details.getAttribute("data-order-index");
        const order = currentUser.orderHistory[orderIndex];

        // Stop if order doesn't exist or already loaded
        if (!order || detailsContent.getAttribute("data-loaded") === "true") {
            return;
        }

        let itemsMarkup = "";

        // Generate list of ordered items dynamically
        order.items.forEach(function(item) {
            itemsMarkup += "<li>" + item + "</li>";
        });

        // Insert order information into HTML
        detailsContent.innerHTML =
            "<p>Date: " + order.date + "</p>" +
            "<p>Total: " + order.total + "</p>" +
            "<p>Items:</p>" +
            "<ul>" + itemsMarkup + "</ul>";

        // Mark as loaded to prevent re-rendering
        detailsContent.setAttribute("data-loaded", "true");
    });
});