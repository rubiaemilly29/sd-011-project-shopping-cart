const itemsSection = document.querySelector('.items');
const shoppingCartItems = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const loadingOverlay = document.querySelector('.loading-overlay');
const loadingText = document.querySelector('.loading');

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

function checkResponse(response) {
  if (!response.ok) {
    throw new Error('Network response was not ok!');
  }

  return response.json();
}

function printFetchError(error) {
  console.error('There has been a problem with your fetch operation:', error);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function isItemInCart(itemId) {
  return Array.from(shoppingCartItems.children)
    .some((item) => item.innerText.includes(itemId));
}

function updateStorage() {
  localStorage.setItem('cart', shoppingCartItems.innerHTML);
  localStorage.setItem('total', totalPrice.innerHTML);
}

function updateTotal(type, value) {
  const parsedValue = Number(`${value}`);
  const currentTotal = Number(`${totalPrice.innerHTML}`);
  const newTotal = type === '+' ? currentTotal + parsedValue : currentTotal - parsedValue;
  const parsedNewTotal = Number(newTotal.toFixed(2));

  totalPrice.innerHTML = parsedNewTotal.toString();
}

function cartItemClickListener(event) {
  event.target.remove();
  updateTotal('-', event.target.dataset.price);
  updateStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');

  li.className = 'cart__item';
  li.dataset.price = salePrice;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  shoppingCartItems.appendChild(li);
  updateTotal('+', salePrice);
  updateStorage();
}

function toggleLoadingZindex() {
  loadingOverlay.classList.toggle('bring-loading-forward');
  loadingText.classList.toggle('bring-loading-forward');
}

function toggleLoading() {
  loadingOverlay.classList.toggle('show-loading');
  loadingText.classList.toggle('show-loading');
}

function fetchItem(itemId) {
  const apiEndpoint = `https://api.mercadolibre.com/items/${itemId}`;
  const requestParameters = { headers: new Headers({ Accept: 'application/json' }) };

  fetch(apiEndpoint, requestParameters)
    .then(checkResponse)
    .then(createCartItemElement)
    .then(() => {
      setTimeout(toggleLoading, 1000);
      setTimeout(toggleLoadingZindex, 1500);
    })
    .catch(printFetchError);
  toggleLoading();
  toggleLoadingZindex();
}

function addItemHandler(event) {
  const itemId = getSkuFromProductItem(event.target.parentElement);

  if (!isItemInCart(itemId)) {
    fetchItem(itemId);
  }
}

function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.dataset.price = price;

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.querySelector('.item__add').addEventListener('click', addItemHandler);

  return section;
}

function initializeCart() {
  const savedCart = localStorage.getItem('cart');

  if (savedCart) {
    shoppingCartItems.innerHTML = savedCart;
    Array
      .from(shoppingCartItems.children)
      .forEach((item) => item.addEventListener('click', cartItemClickListener));
  } else {
    localStorage.setItem('cart', '');
    localStorage.setItem('total', '0');
  }
  totalPrice.innerHTML = localStorage.getItem('total');
}

function processData(data) {
  data.results.forEach((item) => itemsSection.appendChild(createProductItemElement(item)));
}

async function fetchProducts(searchTerm) {
  const apiEndpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${searchTerm}`;
  const requestParameters = { headers: new Headers({ Accept: 'application/json' }) };

  fetch(apiEndpoint, requestParameters)
    .then(checkResponse)
    .then(processData)
    .catch(printFetchError);
}

window.onload = () => {
  fetchProducts('computador');
  initializeCart();
  document.querySelector('.empty-cart').addEventListener('click', () => {
    shoppingCartItems.innerHTML = '';
    totalPrice.innerHTML = '0';
    updateStorage();
  });
};
