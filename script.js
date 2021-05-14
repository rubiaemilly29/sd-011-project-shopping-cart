const itemsCart = document.querySelector('.cart__items');

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
  localStorage.setItem('cart', itemsCart.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// References:
// Rest API Header: https://stackoverflow.com/questions/43209924/rest-api-use-the-accept-application-json-http-header
// Fetch: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// Introduction to Fetch: https://developers.google.com/web/updates/2015/03/introduction-to-fetch
// The Coding Train - Fetch(): https://youtu.be/tc8DU14qX6I

// Task 1
const mercadoLivreAPI = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const method = { method: 'GET', headers: { Accept: 'application/json' } };
  const list = document.querySelector('.items');
  
  return fetch(url, method)
    .then((response) => response.json())
    .then((json) => json.results
    .forEach((items) => list.appendChild(createProductItemElement(
      { sku: items.id, name: items.title, image: items.thumbnail },
    ))));
};

// Task 2
const sendToCart = () => {
  const method = { method: 'GET', headers: { Accept: 'application/json' } };
  const addToCart = document.querySelectorAll('.item__add'); // according to line 22
  const itemsInCart = document.querySelector('.cart__items');

  addToCart.forEach((items) => 
    items.addEventListener('click', () => 
      fetch(`https://api.mercadolibre.com/items/${items.parentNode.children[0].innerText}`, method)
        .then((response) => response.json())
        .then((product) => itemsInCart.appendChild(createCartItemElement(
          { sku: product.id, name: product.title, salePrice: product.price },
      ))).then(() => localStorage.setItem('cart', itemsCart.innerHTML))));
};

// Task 3
const getCart = () => {
  if (localStorage.cart) itemsCart.innerHTML = localStorage.getItem('cart');
};

const asyncStart = async () => {
  await mercadoLivreAPI();
  await sendToCart();
  await getCart();
  itemsCart.addEventListener('click', cartItemClickListener);
};

window.onload = function onload() {
  asyncStart();
};