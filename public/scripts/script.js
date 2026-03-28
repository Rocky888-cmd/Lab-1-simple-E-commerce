// ===============================
// Task 1: Script Foundation & Data Structure
// ===============================

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
    new Product(1, "Gaming Mouse", 700, "assets/mouse.jpg", "detail.html"),
    new Product(2, "Tablet", 10000, "assets/tablet.jpg", "detail.html"),
    new Product(3, "Gaming Laptop", 15000, "assets/victus.jpg", "detail.html"),
    new Product(4, "Charger", 900, "assets/charger1.jpg", "detail.html"),
    new Product(5, "Nintendo", 8500, "assets/nintendo.jpg", "detail.html"),
    new Product(6, "Airpods", 22000, "assets/airpod.jpg", "detail.html"),
    new Product(7, "iPhone", 1200, "assets/iphone.jpg", "detail.html"),
    new Product(8, "Powerbank", 9500, "assets/powerbank.jpg", "detail.html"),
    new Product(9, "Bluewow", 18000, "assets/bluewow.jpg", "detail.html"),
    new Product(10, "Smart Watch", 13000, "assets/smart_watch.jpg", "detail.html")
];

const currentUser = new User("Jona", [
    new Order("February 15, 2024", "$49.99", [
        "4Tech Mouse",
        "RGB, Wireless, Black",
        "Qty: 1",
        "Status: Delivered"
    ]),
    new Order("March 3, 2024", "$15,000.00", [
        "Victus Laptop",
        "16GB RAM, 512GB SSD",
        "Qty: 1",
        "Status: Shipped"
    ])
]);

const CART_STORAGE_KEY = "lab6_cart";

function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function getCartItemCount() {
    return cart.reduce(function(sum, item) {
        return sum + item.quantity;
    }, 0);
}

function updateCartLinks() {
    const cartLinks = document.querySelectorAll('a[href="cart.html"]');
    const cartItemCount = getCartItemCount();

    cartLinks.forEach(function(link) {
        link.textContent = "Cart (" + cartItemCount + ")";
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

function loadCart() {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) {
        return [];
    }

    const parsedCart = JSON.parse(savedCart);

    return parsedCart.map(function(item) {
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

function formatPrice(value) {
    return "$" + value.toLocaleString();
}

function renderLandingProducts() {
    const featuredContainer = document.querySelector(".section2");
    const discountedContainer = document.querySelector(".section3");

    if (featuredContainer) {
        featuredContainer.textContent = "";

        products.slice(0, 5).forEach(function(product) {
            const card = document.createElement("figure");
            const image = document.createElement("img");
            const title = document.createElement("h3");
            const price = document.createElement("p");

            image.setAttribute("src", product.image);
            image.setAttribute("alt", product.name);
            title.appendChild(document.createTextNode(product.name));
            price.appendChild(document.createTextNode("Price: " + formatPrice(product.price)));

            card.appendChild(image);
            card.appendChild(title);
            card.appendChild(price);

            card.addEventListener("click", function() {
                window.location.href = product.detailPage;
            });

            featuredContainer.appendChild(card);
        });
    }

    if (discountedContainer) {
        discountedContainer.textContent = "";

        products.slice(5, 10).forEach(function(product) {
            const card = document.createElement("figure");
            const image = document.createElement("img");
            const title = document.createElement("h3");
            const salePrice = document.createElement("p");
            const originalPrice = document.createElement("del");
            const discountedValue = Math.round(product.price * 0.85);

            image.setAttribute("src", product.image);
            image.setAttribute("alt", product.name);
            title.appendChild(document.createTextNode(product.name));
            salePrice.appendChild(document.createTextNode("Price: " + formatPrice(discountedValue)));
            originalPrice.appendChild(document.createTextNode(formatPrice(product.price)));

            card.appendChild(image);
            card.appendChild(title);
            card.appendChild(salePrice);
            card.appendChild(originalPrice);

            card.addEventListener("click", function() {
                window.location.href = product.detailPage;
            });

            discountedContainer.appendChild(card);
        });
    }
}

function initializeLandingHeroSlider() {
    const heroSection = document.querySelector(".section1");

    if (!heroSection) {
        return;
    }

    const heroTitle = heroSection.querySelector("h1");
    const heroText = heroSection.querySelector("p");
    const heroButton = heroSection.querySelector("button");
    const heroSlides = products.slice(0, 4);
    let currentSlideIndex = 0;

    function renderHeroSlide() {
        const activeProduct = heroSlides[currentSlideIndex];

        heroSection.style.backgroundImage =
            "linear-gradient(135deg, rgba(8, 15, 32, 0.84), rgba(0, 123, 255, 0.42)), url('" +
            activeProduct.image +
            "')";

        heroTitle.textContent = activeProduct.name;
        heroText.textContent =
            "Discover premium gadgets for study, work, and play. Shop the " +
            activeProduct.name +
            " and explore more top tech in our collection.";
        heroButton.textContent = "Shop Now";
        heroButton.onclick = function() {
            window.location.href = activeProduct.detailPage;
        };

        heroSection.classList.remove("hero-slide-active");

        requestAnimationFrame(function() {
            heroSection.classList.add("hero-slide-active");
        });
    }

    renderHeroSlide();

    setInterval(function() {
        currentSlideIndex = (currentSlideIndex + 1) % heroSlides.length;
        renderHeroSlide();
    }, 3000);
}

renderLandingProducts();
initializeLandingHeroSlider();

// ===============================
// Task 2: Dynamic Product Rendering
// ===============================

const productContainer = document.querySelector(".product-grid");

if (productContainer) {
    products.forEach(function(product) {
        const productCard = document.createElement("article");
        productCard.classList.add("product-card");
        productCard.setAttribute("data-href", product.detailPage);
        productCard.setAttribute("tabindex", "0");
        productCard.setAttribute("role", "link");

        const productImage = document.createElement("img");
        productImage.setAttribute("src", product.image);
        productImage.setAttribute("alt", product.name);

        const productBody = document.createElement("div");
        productBody.classList.add("product-body");

        const productTitle = document.createElement("h3");
        productTitle.appendChild(document.createTextNode(product.name));

        const productPrice = document.createElement("p");
        productPrice.classList.add("price");
        productPrice.appendChild(document.createTextNode(String(product.price)));

        const actionContainer = document.createElement("div");
        actionContainer.classList.add("actions");

        const addToCartButton = document.createElement("button");
        addToCartButton.setAttribute("type", "button");
        addToCartButton.setAttribute("data-id", product.id);
        addToCartButton.appendChild(document.createTextNode("Add to Cart"));

        actionContainer.appendChild(addToCartButton);
        productBody.appendChild(productTitle);
        productBody.appendChild(productPrice);
        productBody.appendChild(actionContainer);
        productCard.appendChild(productImage);
        productCard.appendChild(productBody);

        productCard.addEventListener("click", function(event) {
            if (event.target.tagName === "BUTTON") {
                return;
            }

            window.location.href = productCard.getAttribute("data-href");
        });

        productCard.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                window.location.href = productCard.getAttribute("data-href");
            }
        });

        productContainer.appendChild(productCard);
    });
}

// =======================
// Task 3: Event Handling & The Cart
// =======================

let cart = loadCart();

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
        updateCartLinks();

        const productCard = event.target.closest(".product-card");

        if (productCard) {
            productCard.classList.add("fade-in");
            animateAddToCart(productCard);

            setTimeout(function() {
                productCard.classList.remove("fade-in");
            }, 700);
        }
    }
});

function renderCart() {
    const cartList = document.querySelector(".cart-list");
    const totalDisplay = document.getElementById("cart-total");
    const cartEmptyContainer = document.querySelector(".cart-empty-container");
    const cartTotalContainer = document.querySelector(".cart-total-container");

    updateCartLinks();

    if (!cartList) {
        return;
    }

    cartList.textContent = "";

     if (cart.length === 0) {
        if (totalDisplay) {
            totalDisplay.textContent = "$0";
        }

        if (cartEmptyContainer) {
            cartEmptyContainer.style.display = "block";
        }

        if (cartTotalContainer) {
            cartTotalContainer.style.display = "none";
        }

        return;
    }

    if (cartEmptyContainer) {
        cartEmptyContainer.style.display = "none";
    }

    if (cartTotalContainer) {
        cartTotalContainer.style.display = "block";
    }

    cart.forEach(function(item) {
        const listItem = document.createElement("li");
        listItem.classList.add("cart-item");
        listItem.setAttribute("data-id", item.id);

        const itemInfo = document.createElement("div");
        itemInfo.classList.add("cart-item-info");

        const itemImage = document.createElement("img");
        itemImage.classList.add("image-content");
        itemImage.setAttribute("src", item.image);
        itemImage.setAttribute("alt", item.name);

        const itemText = document.createElement("div");
        itemText.classList.add("cart-item-text");

        const name = document.createElement("h3");
        name.appendChild(document.createTextNode(item.name));

        const price = document.createElement("p");
        price.appendChild(document.createTextNode("$" + item.price));

        const itemControls = document.createElement("div");
        itemControls.classList.add("cart-item-controls");

        const quantityControls = document.createElement("div");
        quantityControls.classList.add("quantity-controls");

        const decreaseButton = document.createElement("button");
        decreaseButton.setAttribute("type", "button");
        decreaseButton.setAttribute("data-action", "decrease");
        decreaseButton.setAttribute("data-id", item.id);
        decreaseButton.classList.add("quantity-button");
        decreaseButton.appendChild(document.createTextNode("-"));

        const quantityInput = document.createElement("input");
        quantityInput.setAttribute("type", "text");
        quantityInput.setAttribute("readonly", "readonly");
        quantityInput.setAttribute("data-id", item.id);
        quantityInput.classList.add("quantity-display");
        quantityInput.value = item.quantity;

        const increaseButton = document.createElement("button");
        increaseButton.setAttribute("type", "button");
        increaseButton.setAttribute("data-action", "increase");
        increaseButton.setAttribute("data-id", item.id);
        increaseButton.classList.add("quantity-button");
        increaseButton.appendChild(document.createTextNode("+"));

        const subtotal = document.createElement("p");
        subtotal.classList.add("cart-item-subtotal");
        subtotal.appendChild(document.createTextNode("" + (item.price * item.quantity)));

        itemText.appendChild(name);
        itemText.appendChild(price);
        itemInfo.appendChild(itemImage);
        itemInfo.appendChild(itemText);

        quantityControls.appendChild(decreaseButton);
        quantityControls.appendChild(quantityInput);
        quantityControls.appendChild(increaseButton);

        itemControls.appendChild(quantityControls);
        itemControls.appendChild(subtotal);

        listItem.appendChild(itemInfo);
        listItem.appendChild(itemControls);

        cartList.appendChild(listItem);
    });

    const total = cart.reduce(function(sum, item) {
        return sum + (item.price * item.quantity);
    }, 0);

    if (totalDisplay) {
        totalDisplay.textContent = "" + total;
    }
}

function removeCartItemWithAnimation(id) {
    const cartItemElement = document.querySelector('.cart-item[data-id="' + id + '"]');

    if (cartItemElement) {
        cartItemElement.classList.add("cart-item-removing");

        setTimeout(function() {
            cart = cart.filter(function(cartItem) {
                return cartItem.id != id;
            });

            saveCart();
            renderCart();
        }, 450);
    } else {
        cart = cart.filter(function(cartItem) {
            return cartItem.id != id;
        });

        saveCart();
        renderCart();
    }
}

document.body.addEventListener("click", function(event) {
    if (!event.target.hasAttribute("data-action")) {
        return;
    }

    const action = event.target.getAttribute("data-action");
    const id = event.target.getAttribute("data-id");
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
        return;
    }

    if (action === "decrease") {
        if (item.quantity === 1) {
            removeCartItemWithAnimation(id);
            return;
        }

        item.quantity -= 1;
        saveCart();
        renderCart();
    }
});

renderCart();
updateCartLinks();

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
