const itemsSection = document.querySelector('.items');
const shoppingCartItems = document.querySelector('.cart__items');

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

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');

  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  shoppingCartItems.appendChild(li);
}

function fetchItem(itemId) {
  const apiEndpoint = `https://api.mercadolibre.com/items/${itemId}`;
  const requestParameters = { headers: new Headers({ Accept: 'application/json' }) };

  fetch(apiEndpoint, requestParameters)
    .then(checkResponse)
    .then(createCartItemElement)
    .catch(printFetchError);
}

function addItemHandler(event) {
  const itemId = getSkuFromProductItem(event.target.parentElement);

  if (!isItemInCart(itemId)) {
    fetchItem(itemId);
  }
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.querySelector('.item__add').addEventListener('click', addItemHandler);

  return section;
}

function processData(data) {
  data.results.forEach((item) => itemsSection.appendChild(createProductItemElement(item)));
}

function fetchProducts(searchTerm) {
  const apiEndpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${searchTerm}`;
  const requestParameters = { headers: new Headers({ Accept: 'application/json' }) };

  fetch(apiEndpoint, requestParameters)
    .then(checkResponse)
    .then(processData)
    .catch(printFetchError);
}

window.onload = async () => {
  await fetchProducts('computador');
};
