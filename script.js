function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Evitar repetição
const format = { headers: { Accept: 'application/json' } };
const cartItemsClass = '.cart__items';
const totalPriceClass = '.total-price';

function getPrice(item) {
  const itemInfo = item.innerText;
  const index = itemInfo.lastIndexOf('$') + 1;
  const price = parseFloat(itemInfo.substring(index));
  return price;
}

async function calculateTotalPrice() {
  const totalPrices = document.querySelector(totalPriceClass);
  const products = document.querySelectorAll('li');
  const prices = [];
  products.forEach((product) => prices.push(getPrice(product)));
  const sum = prices.reduce((total, value) => total + value, 0);
  totalPrices.innerText = parseFloat(sum.toFixed(2));
}

async function cartItemClickListener(event) {
  event.target.remove();
  calculateTotalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToLocalStorage = (cartItems) => {
  const lista = cartItems.innerHTML;
  const totalPrice = document.querySelector(totalPriceClass);
  localStorage.setItem('lista', lista);
  localStorage.setItem('price', totalPrice.innerText);
};

const addItemToCart = (sku) => {
  const cartItems = document.querySelector(cartItemsClass);
  const url = `https://api.mercadolibre.com/items/${sku}`;
  fetch(url, format)
    .then((response) => {
      response.json()
        .then((json) => {
          const { title: name, price: salePrice } = json;
          const item = createCartItemElement({ sku, name, salePrice });
          cartItems.appendChild(item);
          calculateTotalPrice();
          addToLocalStorage(cartItems);
        });
    });
};

function addButtonEvent(item) {
  const button = item.querySelector('.item__add');
  button.addEventListener('click', (event) => {
    const itemId = getSkuFromProductItem(event.target.parentNode);
    addItemToCart(itemId);
  });
}

const showProducts = async () => {
  const parent = document.querySelector('.items');
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  await fetch(url, format)
    .then((response) => {
      response.json()
      .then((json) => {
        json.results.forEach((item) => {
          const { id: sku, title: name, thumbnail: image } = item;
          const product = createProductItemElement({ sku, name, image });
          parent.appendChild(product);
          addButtonEvent(product);
        });
      });
    });
};

function loadCart() {
  const cartItems = document.querySelector(cartItemsClass);
  const totalPrice = document.querySelector(totalPriceClass);
  cartItems.innerHTML = localStorage.getItem('lista');
  totalPrice.innerText = localStorage.getItem('price');
  calculateTotalPrice();
}

window.onload = function onload() {
  showProducts();
  loadCart();
  calculateTotalPrice();
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    localStorage.removeItem('lista');
    localStorage.removeItem('price');
    const cartItems = document.querySelector(cartItemsClass);
    while (cartItems.firstChild) {
      cartItems.firstChild.remove();
    }
    calculateTotalPrice();
  });
 };
