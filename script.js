window.onload = onloadFetch();

async function onloadFetch() {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(API_URL)
    .then((r) => r.json())
    .then((r) => r.results.map((resultItem) => createProductItemElement(resultItem)))
};

async function buttonFetch(event) {
  const itemId = event.target.parentNode.firstElementChild.innerHTML;
  const API_URL = `https://api.mercadolibre.com/items/${itemId}`;
  fetch(API_URL)
     .then((r) => r.json())
     .then((r) => createCartItemElement(r));
};

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
  const button = section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  button.addEventListener('click', buttonFetch);
  return document.querySelector('.items').appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return document.querySelector('.cart__items').appendChild(li);
}
