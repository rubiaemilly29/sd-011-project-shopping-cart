const cartClass = '.cart__items';
const cartItemStorage = 'cart-items';
const price = document.querySelector('.total-price');
let cartItems;

if (localStorage.getItem(cartItemStorage)) {
  cartItems = JSON.parse(localStorage.getItem(cartItemStorage));
} else {
  cartItems = [];
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const load = () => {
  const itens = document.querySelector('.items');
  const h2 = document.createElement('h2');
  h2.className = 'loading';
  h2.innerText = 'loading...';
  itens.appendChild(h2);
};

const endLoad = () => {
  document.querySelector('.loading').remove();
};

async function getItens() {
  const loading = document.createElement('p');
  loading.className = 'loading';
  document.body.appendChild(loading);
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const request = await fetch(endpoint);
  const response = await request.json();
  document.querySelector('.loading').remove();
  response.results.forEach((item) => {
      const items = document.querySelector('.items');
      items.appendChild(createProductItemElement(item));
    });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  const id = event.target.innerHTML.split(' ')[1];
  cartItems.forEach((item) => {
    if (item.id === id) {
      cartItems.splice(cartItems.indexOf(item), 1);
    }
  });
  localStorage.removeItem(cartItemStorage);
  localStorage.setItem(cartItemStorage, JSON.stringify(cartItems)); 
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItem(event) {
  const ol = document.querySelector(cartClass);
  if (event.target.className === 'item__add') {
    const idItem = getSkuFromProductItem(event.target.parentNode);
    const endpoint = `https://api.mercadolibre.com/items/${idItem}`;
    const request = await fetch(endpoint);
    const response = await request.json();
    ol.appendChild(createCartItemElement(response));
    const cartobj = { id: response.id, title: response.title, price: response.price };
    cartItems.push(cartobj);
    localStorage.setItem(cartItemStorage, JSON.stringify(cartItems));
  }
}

const removeAll = () => {
  const cart = document.querySelector(cartClass);
  cart.innerHTML = '';
  localStorage.removeItem(cartItemStorage);
  cartItems = [];
};

window.onload = async function onload() { 
 load();
 await getItens();
 const items = document.querySelector('.items');
 items.addEventListener('click', addItem);
 if (localStorage.getItem(cartItemStorage)) {
  const cartItemsWebStorage = JSON.parse(localStorage.getItem(cartItemStorage));
  cartItemsWebStorage.forEach((cartItem) => {
    const item = createCartItemElement(cartItem);
    const ol = document.querySelector('.cart__items');
    ol.appendChild(item);
  });
}
 const removeButton = document.querySelector('.empty-cart');
 removeButton.addEventListener('click', removeAll);
 endLoad();
};