//
const productsContainer = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');

function fetchItem(urlItemId) {
  return new Promise((resolve, reject) => {
    fetch(urlItemId)
      .then((r) => resolve(r.json()))
      .catch((error) => reject(error));
  });
}

async function addToCart(event) {
  const button = event.target;
  const itemId = button.parentElement.firstChild.innerText;
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  const item = await fetchItem(endpoint);
  const { id, title, price } = item;
  const cartItem = createCartItemElement({ sku: id, name: title, salePrice: price });
  cartItems.appendChild(cartItem);
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
  if (element === 'button') {
    e.addEventListener('click', addToCart)
  }
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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const query = 'computador';
const url = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;

function fetchApi(URL) {
  return new Promise((resolve, reject) => {
    fetch(URL)
      .then((r) => r.json())
      .then((json) => resolve(json.results))
      .catch((error) => reject(error));
  });
}

async function createList() {
  const productsList = await fetchApi(url);
  productsList.forEach(({ id, title, thumbnail }) => {
    const product = createProductItemElement({ sku: id, name: title, image: thumbnail });
    productsContainer.appendChild(product);
  });
}

window.onload = function onload() {
  createList();
};
