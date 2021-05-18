const API_ENDPOINT = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  const addItemButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addItemButton.addEventListener('click', () => addItemToCart(id));
  section.appendChild(addItemButton);

  return section;
}

async function fetchApi() {
  const response = await fetch(API_ENDPOINT);
  const jsonResponse = await response.json();
  const itemSection = document.querySelector('section.items');
  
  jsonResponse.results.forEach((item) => {
    itemSection.append(createProductItemElement(item));
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemToCart(itemID) {
  const itemResponse = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const jsonResponse = await itemResponse.json();
  const cartItems = document.querySelector('.cart__items');
  const createdItem = createCartItemElement(jsonResponse);
  cartItems.appendChild(createdItem);
}

window.onload = function onload() { 
  fetchApi();
};
