const API_ENDPOINT = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const cartClassName = '.cart__items';

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

function saveToLocalStorage() {
  const cartContainer = document.querySelector(cartClassName);
  localStorage.setItem('cart', JSON.stringify(cartContainer.innerHTML));
}

function localStorageLoad() {
  const cartItems = document.querySelector(cartClassName);
  const loadedCart = JSON.parse(localStorage.getItem('cart'));
  cartItems.innerHTML = loadedCart;
}

function updatePrice() {
  const cartItems = document.querySelectorAll('.cart__item');
  const totalPrice = document.querySelector('.total-price');
  let sum = 0;
  cartItems.forEach((total) => {
    sum += parseFloat(total.innerText.match(/\d+(.\d+)*$/)[0]);
  });

  totalPrice.innerText = sum;
  saveToLocalStorage();
}

function cartItemClickListener(event) {
  event.target.remove();
  updatePrice();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemToCart(itemID) {
  const itemResponse = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const jsonResponse = await itemResponse.json();
  const cartItems = document.querySelector(cartClassName);
  const createdItem = createCartItemElement(jsonResponse);
  cartItems.appendChild(createdItem);
  updatePrice();
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  const addItemButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addItemButton.addEventListener('click', () => addItemToCart(id));
  section.appendChild(addItemButton);

  return section;
}

async function fetchAPI() {
  const response = await fetch(API_ENDPOINT);
  const jsonResponse = await response.json();
  const itemSection = document.querySelector('section.items');

  jsonResponse.results.forEach((item) => {
    itemSection.append(createProductItemElement(item));
  });
  const loadingElement = document.querySelector('.loading');
  loadingElement.remove();
}

function addCartItems() {
  const cartItems = document.querySelector(cartClassName);
  cartItems.addEventListener('click', (e) => {
    if (e.target.className === 'cart__item') {
      e.target.remove();
      updatePrice();
    }
  });
}

function emptyButton() {
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', () => {
    const cartList = document.querySelector(cartClassName);
    cartList.innerHTML = null;
    updatePrice();
    saveToLocalStorage();
  });
}

window.onload = function onload() {
  fetchAPI();
  localStorageLoad();
  addCartItems();
  updatePrice();
  emptyButton();
};
