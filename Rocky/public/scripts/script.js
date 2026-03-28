class Product {
    constructor(id, name, price, image, detailPage) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.detailPage = detailPage;
    }
}

class CartItem {
    constructor(product, quantity) {
        this.id = product.id;
        this.name = product.name;
        this.price = product.price;
        this.image = product.image;
        this.detailPage = product.detailPage;
        this.quantity = quantity;
    }
}

class Order {
    constructor(date, total, items) {
        this.date = date;
        this.total = total;
        this.items = items;
    }
}

class User {
    constructor(name, orderHistory) {
        this.name = name;
        this.orderHistory = orderHistory;
    }
}

const products = [
    new Product(1, "Wireless AirPods Pro", 199, "assets/airpod.jpg", "detail-airpod.html"),
    new Product(2, "BlueWow Portable Cellphone Cooler", 79, "assets/bluewow.jpg", "detail-bluewow.html"),
    new Product(3, "120W Fast Charger", 25, "assets/charger.jpg", "detail-charger.html"),
    new Product(4, "Redmi 120W Fast Charger", 29, "assets/charger1.jpg", "detail-charger1.html"),
    new Product(5, "iPhone 15", 999, "assets/iphone.jpg", "detail-iphone.html"),
    new Product(6, "Adjustable Laptop Stand", 39, "assets/laptop-stand.jpg", "detail-laptop-stand.html"),
    new Product(7, "Gaming Mouse", 49, "assets/mouse.jpg", "detail-mouse.html"),
    new Product(8, "Nintendo Switch OLED", 349, "assets/nintendo.jpg", "detail-nintendo.html"),
    new Product(9, "Power Bank 20000mAh", 45, "assets/powerbank.jpg", "detail-powerbank.html"),
    new Product(10, "Smart Watch Series X", 129, "assets/smart_watch.jpg", "detail-smart-watch.html"),
    new Product(11, "Android Tablet 11", 299, "assets/tablet.jpg", "detail-tablet.html"),
    new Product(12, "HP Victus Laptop", 1199, "assets/victus.jpg", "detail-victus.html")
];

const currentUser = new User("Rocky", [
    new Order("February 15, 2024", "$49.99", [
        "Gaming Mouse",
        "RGB, Wireless, Black",
        "Qty: 1",
        "Status: Delivered"
    ]),
    new Order("March 3, 2024", "$1,199.00", [
        "HP Victus Laptop",
        "16GB RAM, 512GB SSD",
        "Qty: 1",
        "Status: Shipped"
    ])
]);

const CART_STORAGE_KEY = "rocky_lab6_cart";
let cart = loadCart();

function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) {
        return [];
    }

    return JSON.parse(savedCart).map(function(item) {
        const product = new Product(
            item.id,
            item.name,
            item.price,
            item.image,
            item.detailPage || "detail.html"
        );

        return new CartItem(product, item.quantity);
    });
}

function getCartItemCount() {
    return cart.reduce(function(sum, item) {
        return sum + item.quantity;
    }, 0);
}

function updateCartLinks() {
    document.querySelectorAll('a[href="cart.html"]').forEach(function(link) {
        link.textContent = "Cart (" + getCartItemCount() + ")";
        link.setAttribute("data-count", getCartItemCount());
    });
}

function animateAddToCart(productCard) {
    const cartLink = document.querySelector('a[href="cart.html"]');

    if (!productCard || !cartLink) {
        return;
    }

    const productRect = productCard.getBoundingClientRect();
    const cartRect = cartLink.getBoundingClientRect();
    const flyingCard = productCard.cloneNode(true);

    flyingCard.classList.remove("fade-in");
    flyingCard.classList.add("cart-fly-item");
    flyingCard.style.top = productRect.top + "px";
    flyingCard.style.left = productRect.left + "px";
    flyingCard.style.width = productRect.width + "px";
    flyingCard.style.height = productRect.height + "px";

    document.body.appendChild(flyingCard);

    requestAnimationFrame(function() {
        flyingCard.style.top = cartRect.top + "px";
        flyingCard.style.left = cartRect.left + "px";
        flyingCard.style.width = "60px";
        flyingCard.style.height = "60px";
        flyingCard.style.opacity = "0.2";
        flyingCard.style.transform = "scale(0.25)";
    });

    setTimeout(function() {
        flyingCard.remove();
        cartLink.classList.add("cart-link-pop");

        setTimeout(function() {
            cartLink.classList.remove("cart-link-pop");
        }, 300);
    }, 700);
}

function renderCart() {
    const cartList = document.querySelector(".cart-list");
    const totalDisplay = document.getElementById("cart-total");
    const emptyContainer = document.querySelector(".cart-empty-container");
    const totalContainer = document.querySelector(".cart-total-container");

    updateCartLinks();

    if (!cartList) {
        return;
    }

    cartList.textContent = "";

    if (cart.length === 0) {
        if (totalDisplay) {
            totalDisplay.textContent = "$0";
        }

        if (emptyContainer) {
            emptyContainer.style.display = "block";
        }

        if (totalContainer) {
            totalContainer.style.display = "none";
        }

        return;
    }

    if (emptyContainer) {
        emptyContainer.style.display = "none";
    }

    if (totalContainer) {
        totalContainer.style.display = "block";
    }

    cart.forEach(function(item) {
        const listItem = document.createElement("li");
        listItem.classList.add("cart-item");
        listItem.setAttribute("data-id", item.id);

        const image = document.createElement("img");
        image.classList.add("cart-item-image");
        image.setAttribute("src", item.image);
        image.setAttribute("alt", item.name);

        const details = document.createElement("div");
        details.classList.add("cart-item-details");

        const name = document.createElement("h3");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = "$" + item.price.toLocaleString();

        const qtyWrap = document.createElement("div");
        qtyWrap.classList.add("cart-item-qty");

        const decrease = document.createElement("button");
        decrease.type = "button";
        decrease.classList.add("qty-btn");
        decrease.setAttribute("data-action", "decrease");
        decrease.setAttribute("data-id", item.id);
        decrease.textContent = "-";

        const qty = document.createElement("input");
        qty.classList.add("qty-input");
        qty.type = "text";
        qty.readOnly = true;
        qty.value = item.quantity;

        const increase = document.createElement("button");
        increase.type = "button";
        increase.classList.add("qty-btn");
        increase.setAttribute("data-action", "increase");
        increase.setAttribute("data-id", item.id);
        increase.textContent = "+";

        const subtotal = document.createElement("p");
        subtotal.classList.add("cart-item-total");
        subtotal.textContent = "$" + (item.price * item.quantity).toLocaleString();

        details.appendChild(name);
        details.appendChild(price);
        qtyWrap.appendChild(decrease);
        qtyWrap.appendChild(qty);
        qtyWrap.appendChild(increase);

        listItem.appendChild(image);
        listItem.appendChild(details);
        listItem.appendChild(qtyWrap);
        listItem.appendChild(subtotal);
        cartList.appendChild(listItem);
    });

    if (totalDisplay) {
        totalDisplay.textContent = "$" + cart.reduce(function(sum, item) {
            return sum + (item.price * item.quantity);
        }, 0).toLocaleString();
    }
}

function removeCartItemWithAnimation(id) {
    const cartItemElement = document.querySelector('.cart-item[data-id="' + id + '"]');

    if (cartItemElement) {
        cartItemElement.classList.add("cart-item-removing");

        setTimeout(function() {
            cart = cart.filter(function(item) {
                return item.id != id;
            });

            saveCart();
            renderCart();
        }, 450);
    }
}

document.body.addEventListener("click", function(event) {
    if (event.target.tagName === "BUTTON" && event.target.textContent === "Add to Cart") {
        const productId = event.target.getAttribute("data-id");
        const selectedProduct = products.find(function(product) {
            return product.id == productId;
        });

        if (!selectedProduct) {
            return;
        }

        const existingItem = cart.find(function(item) {
            return item.id == productId;
        });

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(new CartItem(selectedProduct, 1));
        }

        saveCart();
        renderCart();

        const productCard = event.target.closest(".product-card");

        if (productCard) {
            productCard.classList.add("fade-in");
            animateAddToCart(productCard);

            setTimeout(function() {
                productCard.classList.remove("fade-in");
            }, 700);
        }
    }

    if (event.target.hasAttribute("data-action")) {
        const id = event.target.getAttribute("data-id");
        const action = event.target.getAttribute("data-action");
        const item = cart.find(function(cartItem) {
            return cartItem.id == id;
        });

        if (!item) {
            return;
        }

        if (action === "increase") {
            item.quantity += 1;
            saveCart();
            renderCart();
        }

        if (action === "decrease") {
            if (item.quantity === 1) {
                removeCartItemWithAnimation(id);
            } else {
                item.quantity -= 1;
                saveCart();
                renderCart();
            }
        }
    }
});

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
            window.location.href = "thankyou.html";
        }
    });
}

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

renderCart();
updateCartLinks();
