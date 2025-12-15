'use strict';

/*=== ADD EVENTS ON AN ELEMENT ===*/
const addEventOnElem = function (elem, type, callback) {
    if (elem.length > 1){
        for (let i = 0; i < elem.length; i++){
            elem[i].addEventListener(type, callback);
        }
    } else {
        elem.addEventListener(type, callback);
    }
}

/*=== MENU TOGGLE - yung three lines ===*/
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("active");
} 

addEventOnElem(navbarLinks, "click", closeNavbar);  

/*=== HEADER & BACK TO ACTIVE - when scrolling down to 100px ===*/
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const showElemOnScroll = function () {
    if (window.scrollY > 100) {
        header.classList.add("active");
        backTopBtn.classList.add("active");
    } else {
        header.classList.remove("active");
        backTopBtn.classList.remove("active");
    }
}

addEventOnElem(window, "scroll", showElemOnScroll);

/*=== PRODUCT FILTER ===*/
const filterBtns = document.querySelectorAll("[data-filter-btn]");
const filterBox = document.querySelector("[data-filter]");

let lastClickedFilterBtn = filterBtns[0];

const filter = function () {
  lastClickedFilterBtn.classList.remove("active");
  this.classList.add("active");
  lastClickedFilterBtn = this;

  filterBox.setAttribute("data-filter", this.dataset.filterBtn)
}

addEventOnElem(filterBtns, "click", filter);

/*=== BASKET ===*/
const basket = document.querySelector("[data-basket]");
const basketTogglers = document.querySelectorAll("[data-basket-toggler]");
const overlayBasket = document.querySelector("[data-overlay-basket]");
const basketClose = document.querySelector("#basket-close");

const toggleBasket = function () {
    basket.classList.toggle("active");
    overlayBasket.classList.toggle("active");
};

addEventOnElem(basketTogglers, "click", toggleBasket);

const closeBasket = function () {
    basket.classList.remove("active");
    overlayBasket.classList.remove("active");
};

basketClose.addEventListener("click", closeBasket);

overlayBasket.addEventListener("click", closeBasket);

/* === BASKET FUNCTIONS === */
const addBasketButtons = document.querySelectorAll(".add-basket");
const basketContent = document.querySelector(".basket-content");
const totalPriceElement = document.querySelector(".total-price");

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    let cleaned = priceStr.replace(/[^\d.,-]/g, "").replace(/,/g, "");
    const value = parseFloat(cleaned);
    return isNaN(value) ? 0 : value;
}

addBasketButtons.forEach(button => {
    button.addEventListener("click", event => {
        const productCard = event.target.closest(".product-card");
        if (!productCard) {
            console.warn("add-basket: couldn't find .product-card ancestor");
            return;
        }
        addToBasket(productCard);
    });
});

function addToBasket(productCard) {
    const productImgSrc = productCard.querySelector("img").src;
    const productCardTitle = productCard.querySelector(".card-title").textContent;
    const productPriceText = productCard.querySelector(".price").textContent;

    const existingTitles = Array.from(basketContent.querySelectorAll(".basket-product-title")).map(n => n.textContent);
    if (existingTitles.includes(productCardTitle)) {
        alert("This item already exists in Your Basket :3");
        return;
    }

    const basketCard = document.createElement("div");
    basketCard.classList.add("basket-box");
    basketCard.innerHTML = `
        <img src="${productImgSrc}" class="basket-img" alt="">
        <div class="basket-detail">
            <h2 class="basket-product-title">${productCardTitle}</h2>
            <span class="basket-price">${productPriceText}</span>
            <div class="basket-quantity">
                <button class="decrement" type="button">-</button>
                <span class="number">1</span>
                <button class="increment" type="button">+</button>
            </div>
        </div>
        <ion-icon class="delete-product basket-remove" name="trash"></ion-icon>
    `;

    basketContent.appendChild(basketCard);
    updateBasketBadge();
    updateTotalPrice();
}

function updateTotalPrice() {
    try {
        const basketBoxes = basketContent.querySelectorAll(".basket-box");
        let total = 0;

        basketBoxes.forEach(basketCard => {
            const priceEl = basketCard.querySelector(".basket-price");
            const qtyEl = basketCard.querySelector(".number");
            if (!priceEl || !qtyEl) return;

            const priceRaw = priceEl.textContent || "";
            const qty = parseInt(qtyEl.textContent) || 1;
            const price = parsePrice(priceRaw);

            total += price * qty;
        });

        totalPriceElement.textContent = `Php ${total.toFixed(2)}`;
        console.log("updateTotalPrice:", total.toFixed(2));
    } catch (err) {
        console.error("Error in updateTotalPrice:", err);
    }
}

function escapeHtml(str) {
    return str
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

const basketBadge = document.querySelector(".btn-badge");

function updateBasketBadge() {
    const basketBoxes = basketContent.querySelectorAll(".basket-box");
    let totalQuantity = 0;

    basketBoxes.forEach(basketCard => {
        const qtyEl = basketCard.querySelector(".number");
        const quantity = parseInt(qtyEl.textContent) || 1;
        totalQuantity += quantity;
    });

    basketBadge.textContent = totalQuantity;
}

basketContent.addEventListener("click", (event) => {
    const target = event.target;
    const basketCard = target.closest(".basket-box");
    if (!basketCard) return;

    const numberEl = basketCard.querySelector(".number");
    let qty = parseInt(numberEl.textContent) || 1;

    if (target.classList.contains("increment")) {
        qty++;
        numberEl.textContent = qty;
    } else if (target.classList.contains("decrement")) {
        if (qty > 1) qty--;
        numberEl.textContent = qty;
    } else if (target.classList.contains("basket-remove")) {
        basketCard.remove();
        updateBasketBadge();
        updateTotalPrice();
        return;
    }

    updateBasketBadge();
    updateTotalPrice();
});

/*=== CHECKOUT PURCHASE CONFIRMATION ===*/
const btnBuy = document.querySelector(".btn-buy");
const checkoutModal = document.getElementById("checkout-modal");
const checkoutOverlay = document.getElementById("checkout-overlay");
const checkoutItemsContainer = checkoutModal.querySelector(".checkout-items");
const subtotalEl = checkoutModal.querySelector(".checkout-subtotal");
const totalEl = checkoutModal.querySelector(".checkout-total");
const shippingEl = checkoutModal.querySelector(".checkout-shipping");
const confirmOrderBtn = checkoutModal.querySelector("#confirm-order");
const closeCheckoutBtn = checkoutModal.querySelector("#close-checkout");

const SHIPPING_FEE = 50;

function formatPrice(value) {
    return `Php ${parseFloat(value).toFixed(2)}`;
}

btnBuy.addEventListener("click", () => {
    checkoutItemsContainer.innerHTML = "";
    let subtotal = 0;

    const basketBoxes = basketContent.querySelectorAll(".basket-box");

    if (basketBoxes.length === 0) {
        alert("Your basket is empty!");
        return;
    }

    basketBoxes.forEach(basketCard => {
        const imgSrc = basketCard.querySelector("img").src;
        const title = basketCard.querySelector(".basket-product-title").textContent;
        const priceText = basketCard.querySelector(".basket-price").textContent.replace("Php", "").trim();
        const qty = parseInt(basketCard.querySelector(".number").textContent) || 1;
        const price = parseFloat(priceText);

        subtotal += price * qty;

        const itemEl = document.createElement("div");
        itemEl.classList.add("checkout-item");

        itemEl.innerHTML = `
            <img src="${imgSrc}" alt="${title}">
            <div class="checkout-item-info">
                <span>${title} x${qty}</span>
                <span>${formatPrice(price * qty)}</span>
            </div>
        `;

        checkoutItemsContainer.appendChild(itemEl);
    });

    subtotalEl.textContent = formatPrice(subtotal);
    shippingEl.textContent = formatPrice(SHIPPING_FEE);
    totalEl.textContent = formatPrice(subtotal + SHIPPING_FEE);

    checkoutModal.classList.add("active");
    checkoutOverlay.classList.add("active");
});

checkoutOverlay.addEventListener("click", () => {
    checkoutModal.classList.remove("active");
    checkoutOverlay.classList.remove("active");
});

closeCheckoutBtn.addEventListener("click", () => {
    checkoutModal.classList.remove("active");
    checkoutOverlay.classList.remove("active");
});

confirmOrderBtn.addEventListener("click", () => {
    alert("Your order has been confirmed! Thank you!");
    
    checkoutModal.classList.remove("active");
    checkoutOverlay.classList.remove("active");

    basketContent.innerHTML = "";
    updateBasketBadge();
    updateTotalPrice();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

async function redirectToDashboard() {
  try {
    const response = await fetch('check-session.php', {
      method: 'GET',
      credentials: 'include'
    });
    const data = await response.json();
    console.log('check-session result:', data);

    if (data.loggedIn) {
      if (data.role === 'admin') {
        window.location.href = 'dashboard.htm';
      } else if (data.role === 'user') {
        window.location.href = 'user-dashboard.htm';
      } else {
        window.location.href = 'login.htm';
      }
    } else {
      window.location.href = 'login.htm';
    }
  } catch (error) {
    console.error('Error checking session:', error);
    window.location.href = 'login.htm';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  loadLandingProfilePicture();

  const userIcon = document.querySelector('#user-icon-btn');
  if (userIcon) {
    userIcon.addEventListener('click', function(e) {
      e.preventDefault();
      redirectToDashboard();
    });
  }
});

/* ------------------ PROFILE PICTURE DISPLAY  ------------------ */
function loadLandingProfilePicture() {
  const savedPic = localStorage.getItem('profilePic');
  const profileIcon = document.querySelector("#user-icon-btn"); 
  
  if (savedPic && profileIcon) {
    profileIcon.innerHTML = `<img src="uploads/profiles/${savedPic}" 
                               style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;" 
                               alt="Profile Picture">`;
    profileIcon.style.fontSize = "0";
  }
}

/*=== PRODUCT VIEW MODAL USING EXISTING BUTTONS ===*/
const productViewModal = document.getElementById("product-view-modal");
const productViewOverlay = document.getElementById("product-view-overlay");
const productViewClose = document.getElementById("product-view-close");
const productViewImg = document.getElementById("product-view-img");
const productViewTitle = document.getElementById("product-view-title");
const productViewPrice = document.getElementById("product-view-price");
const productViewCategory = document.getElementById("product-view-category");
const productViewAddBasket = document.getElementById("product-view-add-basket");
const existingViewButtons = document.querySelectorAll('button[title="view product"]');

existingViewButtons.forEach(button => {
    button.addEventListener("click", () => {
        const productCard = button.closest(".product-card");
        if (!productCard) return;

        const imgSrc = productCard.querySelector("img").src;
        const title = productCard.querySelector(".card-title").textContent;
        const price = productCard.querySelector(".price") ? productCard.querySelector(".price").textContent : "";
        const category = productCard.dataset.category || "";

        productViewImg.src = imgSrc;
        productViewTitle.textContent = title;
        productViewPrice.textContent = price;
        productViewCategory.textContent = category;

        productViewModal.classList.add("active");
        productViewOverlay.classList.add("active");
    });
});

function closeProductView() {
    productViewModal.classList.remove("active");
    productViewOverlay.classList.remove("active");
}

productViewClose.addEventListener("click", closeProductView);
productViewOverlay.addEventListener("click", closeProductView);
productViewAddBasket.addEventListener("click", () => {
    const tempCard = document.createElement("div");
    tempCard.innerHTML = `
        <img src="${productViewImg.src}" class="card-img" alt="">
        <h2 class="card-title">${productViewTitle.textContent}</h2>
        <span class="price">${productViewPrice.textContent}</span>
    `;
    addToBasket(tempCard); 
    closeProductView();
    
});

