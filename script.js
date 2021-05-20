// create product image
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// create custom element
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// create and append products
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// Task 5
// Sum of all items in the cart

const total = document.querySelector('.total-price');

const totalPrice = (prices) => {
  // total-price recieves by innerText all values summed converted to float type
  total.innerText = (parseFloat(total.innerText) + parseFloat(prices));
};

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

// Task 3
// Event Target: https://developer.mozilla.org/en-US/docs/Web/API/Event/target
// split(): https://www.w3schools.com/jsref/jsref_split.asp
// localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

const itemsCart = document.querySelector('.cart__items');

// remove cart's items
function cartItemClickListener(event) {
  totalPrice(-event.target.innerText.split('$')[1]); // the minus here are negativing all variables inside
  event.target.remove();
  localStorage.setItem('cart', itemsCart.innerHTML);
  localStorage.setItem('price', total.innerText);
}

// create cart items on click
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Task 7
// Loadings

const list = document.querySelector('.items');

const nowLoading = () => {
  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerText = 'Now loading...';
  list.appendChild(loading);
};

const endLoading = () => {
  const loading = document.querySelector('.loading');
  loading.remove();
};

// Task 1
// References:
// Rest API Header: https://stackoverflow.com/questions/43209924/rest-api-use-the-accept-application-json-http-header
// Fetch: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// Introduction to Fetch: https://developers.google.com/web/updates/2015/03/introduction-to-fetch
// The Coding Train - Fetch(): https://youtu.be/tc8DU14qX6I

// fetch mercado livre API plus Loading functions
const mercadoLivreAPI = () => {
  nowLoading();
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const method = { method: 'GET', headers: { Accept: 'application/json' } };
  const itemsClass = document.querySelector('.items');

  return fetch(url, method)
    .then((response) => response.json())
    .then((json) => {
      json.results.forEach((items) => itemsClass.appendChild(
          createProductItemElement({ sku: items.id, name: items.title, image: items.thumbnail }),
        ));
      })
      .then(endLoading);
};

// Task 2
// Add items to the cart and localStorage
const sendToCart = () => {
  const addItemToCart = document.querySelectorAll('.item__add');
  const method = { method: 'GET', headers: { Accept: 'application/json' } };
  const cartItems = document.querySelector('.cart__items');

  addItemToCart.forEach((items) =>
    items.addEventListener('click', () =>
      fetch(`https://api.mercadolibre.com/items/${items.parentNode.children[0].innerText}`, method)
        .then((response) => response.json())
        .then((json) => {
          cartItems.appendChild(
            createCartItemElement({ sku: json.id, name: json.title, salePrice: json.price }),
          );
          totalPrice(json.price);
        })
        .then(() => localStorage.setItem('cart', itemsCart.innerHTML))
        .then(() => localStorage.setItem('price', total.innerText))));
};

// Task 4
// get cart's items on localStorage
const getCart = () => {
  if (localStorage.cart) {
    itemsCart.innerHTML = localStorage.getItem('cart');
    itemsCart.addEventListener('click', cartItemClickListener);
    total.innerText = localStorage.getItem('price');
  }
};

// Task 6
// clean cart
const emptyCart = () => {
  localStorage.clear();
  itemsCart.innerHTML = '';
};

// clear button EventListener
const empty = document.querySelector('.empty-cart');
empty.addEventListener('click', emptyCart);

// async functions
const asyncStart = async () => {
  await mercadoLivreAPI();
  await getCart();
  await sendToCart();
};

// start window.onload
window.onload = function onload() {
  asyncStart();
};
