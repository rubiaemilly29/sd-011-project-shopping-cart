const items = document.querySelector('.items');
const cart = document.querySelector('.cart__items');

async function toggleLoading() {
  let loading = document.querySelector('.loading');
  if (!loading) {
    loading = document.createElement('h2');
    loading.classList.add('loading');
    loading.innerText = 'Loading';
    cart.parentElement.appendChild(loading);
  } else {
    loading.remove();
  }
}

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

function saveCart() {
  const cartItems = document.querySelectorAll('.cart__items li');
  const idList = [];
  if (cartItems !== null) {
    cartItems.forEach((item) => {
      const id = item.innerText.split(' |')[0];
      idList.push(id.split(': ')[1]);
    });
  }
  localStorage.setItem('cart', idList);
}

function cartItemClickListener(event) {
  // cart.removeChild(event.target);
  event.target.remove();
  saveCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
async function fetchProduct(query) {
  return fetch(`https://api.mercadolibre.com/items/${query}`)
  .then((response) => response.json());
}

async function appendCartItem(event) {
  let id;
  if (typeof event === 'string') {
    id = event;
  } else {
    id = getSkuFromProductItem(event.target.parentElement);
  }
  await toggleLoading();
  const product = await fetchProduct(id);
  const { title: name, price: salePrice } = product;
  cart.appendChild(createCartItemElement({ sku: id, name, salePrice }));
  await toggleLoading();
  saveCart();
}

async function fetchProductList(query) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => response.json())
  .then((response) => response.results);
}

async function appendProductList(query) {
  await toggleLoading();
  const productList = await fetchProductList(query);
  await productList.forEach((element) => {
    const { id: sku, title: name, thumbnail: image } = element;
    items.appendChild(createProductItemElement({ sku, name, image }));
  });
  const buttonList = document.querySelectorAll('.item__add');
  buttonList.forEach((element) => element.addEventListener('click', appendCartItem));
  await toggleLoading();
}

function loadCart() {
  const cartIds = localStorage.getItem('cart');
  if (cartIds) {
    cartIds.split(',').forEach((element) => appendCartItem(element));
  }
}

function emptyCart() {
  Array.from(cart.childNodes).forEach((element) => element.remove());
  saveCart();
}

function addEventEmptyCart() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', emptyCart);
}

window.onload = function onload() {
  addEventEmptyCart();
  appendProductList('computador');
  loadCart();
};