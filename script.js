// create product image
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// create custom elements
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
  const totalFloat = parseFloat(total);
  const pricesFloat = parseFloat(prices);
  total.innerText = totalFloat + pricesFloat;
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
  // thanks to Cesar Bhering's explanation and help
  totalPrice(-event.target.innerText.split('$')[1]); // the subtration symbol here are negating all values inside *string.split(separator, limit)
  event.target.remove(); // remove event on click (on this case, the EventListener in line 150)
  localStorage.setItem('cart', itemsCart.innerHTML); // innerHTML cause cart contains objects, images and so far, html elements.
  localStorage.setItem('price', total.innerText); // innerText cause is just text (numbers in this case)
}

// create cart items on click
// SKU = Stock Keeping Unit, it's like an ID for stocking units
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
  const loading = document.createElement('p'); // create paragraph element
  loading.className = 'loading'; // add loading to class loading
  loading.innerText = 'Now loading...'; // add text to loading
  list.appendChild(loading); // append loading to section with list class
};

const endLoading = () => {
  const loading = document.querySelector('.loading'); // get loading paragraph
  loading.remove(); // remove it
};

// Task 1
// References:
// Fetch: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// Introduction to Fetch: https://developers.google.com/web/updates/2015/03/introduction-to-fetch
// The Coding Train - Fetch(): https://youtu.be/tc8DU14qX6I

// fetch mercado livre API plus Loading functions
const mercadoLivreAPI = () => {
  nowLoading(); // calls nowLoading function

  // get Mercado Livre API url
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

  // API Header: https://stackoverflow.com/questions/43209924/rest-api-use-the-accept-application-json-http-header
  const method = { method: 'GET', headers: { Accept: 'application/json' } };

  return fetch(url, method) // fetch API's url and method/accept
    .then((response) => response.json()) // gets and converts the response to json
    .then((json) => { // then uses json for each items on the list
      json.results.forEach((items) => list.appendChild(createProductItemElement(
        { sku: items.id, name: items.title, image: items.thumbnail },
      )));
    })
    .then(endLoading); // calls endLoading function
};

// Task 2
// Add items to the cart and localStorage
const sendToCart = () => {
  // get alls items from createProductItemElement in line 25
  const addItemToCart = document.querySelectorAll('.item__add');
  // API Header
  const method = { method: 'GET', headers: { Accept: 'application/json' } };

  // for each items in addItemToCart add an EventListener to add the specific item fetched to the cart on the page and LocalStorage
  addItemToCart.forEach((items) =>
    items.addEventListener('click', () => // thanks to https://stackoverflow.com/questions/40710922/how-can-i-add-item-to-cart-by-using-event-listener
      fetch(`https://api.mercadolibre.com/items/${items.parentNode.children[0].innerText}`, method)
        .then((response) => response.json())
        .then((json) => {
          itemsCart.appendChild(createCartItemElement(
            { sku: json.id, name: json.title, salePrice: json.price },
          ));
          totalPrice(json.price);
        })
        .then(() => localStorage.setItem('cart', itemsCart.innerHTML))
        .then(() => localStorage.setItem('price', total.innerText))));
};

// Task 4
// get cart's items on localStorage
const getCart = () => {
  if (localStorage.cart) { // if there's a key called cart on localStorage, then...
    itemsCart.innerHTML = localStorage.getItem('cart'); // localStorage gets itemsCart
    itemsCart.addEventListener('click', cartItemClickListener); // add the click event to get cart's items
    total.innerText = localStorage.getItem('price'); // gets the item's price
  }
};

// Task 6
// clean cart
const emptyCart = () => {
  localStorage.clear(); // clears the localStorage
  itemsCart.innerHTML = ''; // insert blank text
};

// clear button EventListener
const empty = document.querySelector('.empty-cart'); // gets the button by empty-cart class
empty.addEventListener('click', emptyCart); // add the event click to it

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
