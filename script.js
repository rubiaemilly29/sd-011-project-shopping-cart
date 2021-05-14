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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const getItens = () => {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint)
  .then((response) => response.json())
  .then((result) => {
    result.results.forEach((item) => {
      const items = document.querySelector('.items');
      items.appendChild(createProductItemElement(item));
    });
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  ol.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItem = (event) => {
  const ol = document.querySelector('.cart__items');
  if (event.target.className === 'item__add') {
    const idItem = getSkuFromProductItem(event.target.parentNode);
    const endpoint = `https://api.mercadolibre.com/items/${idItem}`;
    fetch(endpoint)
    .then((response) => response.json())
    .then((item) => ol.appendChild(createCartItemElement(item)));
  }
};

const removeAll = () => {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = '';
};

window.onload = function onload() { 
 getItens();
 const items = document.querySelector('.items');
 const cartItems = document.querySelector('.empty-cart');
 items.addEventListener('click', addItem);
 cartItems.addEventListener('click', removeAll);
};