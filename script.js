let totalPrice = 0;
 // const cart = document.querySelector('.cart__items');

function loading() {
  const sectionSpan = document.querySelector('.cart');
  const spanLoading = document.createElement('span');
  spanLoading.className = 'loading';
  sectionSpan.appendChild(spanLoading);
  spanLoading.innerText = 'loading';
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

function unload() {
  const sectionSpan = document.querySelector('.cart');
  const spanLoading = document.querySelector('.loading');
  sectionSpan.removeChild(spanLoading);
}

const sum = (price) => {
  totalPrice += price;
  document.querySelector('.total-price').innerText = totalPrice;
};

const newLocal = '.cart__items';
function saveLocal() {
   const cart = document.querySelector(newLocal);
  localStorage.setItem('cart', cart.innerHTML);
}

function cartItemClickListener(event) {
  const element = event.target;
  const price = parseFloat(element.innerText.split('$')[1]);
  totalPrice -= price;
  document.querySelector('.total-price').innerText = totalPrice;
  element.remove();
  // saveLocal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = async (event) => {
  const itemId = event.target.parentNode.firstChild.innerText;
   const cart = document.querySelector(newLocal);
  return fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((response) => response.json())
  .then((itemDetail) => {
    const { id, title, price } = itemDetail;
    const cartItem = { sku: id, name: title, salePrice: price };
    const add = createCartItemElement(cartItem);
    cart.appendChild(add);
    sum(price);
    saveLocal();
  });
};

function createProductItemElement({ sku, name, image }) {
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);
  button.addEventListener('click', addToCart);
  return section;
}
async function fetchMercadoLivre(term) {
  loading();
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${term}`;
  const response = await fetch(endpoint);
  const object = await response.json();
   const { results } = object;
  const itemsElement = document.querySelector('.items');
  results.forEach((result) => {
    const { id: sku, title: name, thumbnail: image } = result;
    const element = createProductItemElement({ sku, name, image });
    itemsElement.appendChild(element);
  });
  unload();
}

// function getSkuFromProductItem(item) {
  //   return item.querySelector('span.item__sku').innerText;
// }

function clear() {
  const deleteCart = document.querySelector('.empty-cart');
  deleteCart.addEventListener('click', function () {
   const cart = document.querySelector(newLocal);
    cart.innerHTML = '';
    totalPrice = 0;
    saveLocal();
  });
}

function loadLoacal() {
   const cart = document.querySelector('.cart__items');
  cart.innerHTML = localStorage.getItem('cart') || '';
}

window.onload = function onload() {
  fetchMercadoLivre('computador');
  clear();
  loadLoacal();
};