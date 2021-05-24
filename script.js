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

function cartItemClickListener(event) {
  const cart = document.querySelector('.cart__items');
  cart.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function productsList(query) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json())
    .then((json) => {
      json.results.forEach((result) => {
        const { id, title, thumbnail } = result;
        const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
        document.querySelector('.items').appendChild(item);
      });
    });
}

async function fetchToCart(itemId) {
  const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const product = await response.json();
  const { id, title, price } = product;
  const cartItem = createCartItemElement({ sku: id, name: title, salePrice: price });
  const cart = document.querySelector('.cart__items');
  cart.appendChild(cartItem);
}

function addItem(event) {
  const id = getSkuFromProductItem(event.target.parentElement);
  fetchToCart(id);
}

function buttonAddEventListener() {
  document.querySelectorAll('.item__add').forEach((button) => button
    .addEventListener('click', addItem));
}

window.onload = function onload() {
  productsList('computador');
  setTimeout(() => buttonAddEventListener(), 400);
};