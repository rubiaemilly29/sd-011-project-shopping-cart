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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener() {
  const cartRmv = document.getElementsByClassName('cart__items')[0];
  cartRmv.addEventListener('click', function (event) {
    event.target.remove();
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getApi() {
  const urlApi = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  return new Promise((resolve) => {
    fetch(urlApi)
    .then((response) => { 
      response.json().then((data) => {
        const result = data.results;
        resolve(result);
      });
    });
  });
}

async function getApiId(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const responseJson = await response.json();
  return responseJson;
}

function tookElements() {
  getApi()
  .then((result) => {
    result.forEach((current) => {
      const { id: sku, title: name, thumbnail: image } = current;
      const elementFrame = createProductItemElement({ sku, name, image });
      const itemLocation = document.querySelector('.items');
      itemLocation.appendChild(elementFrame);
    });
  });
}

function fetchElementId(item) {
  getApiId(item)
    .then((result) => {
      const { id: sku, title: name, base_price: salePrice } = result;
      const cartElementFrame = createCartItemElement({ sku, name, salePrice });
      const cart = document.querySelector('.cart__items');
      cart.appendChild(cartElementFrame);
    });
}

function addToCart() {
  const items = document.querySelectorAll('.items');
  console.log(items);
  items.forEach((button) => {
    button.addEventListener('click', function (event) {
      const itemId = getSkuFromProductItem(event.target.parentNode);
      if (event.target.className === 'item__add') {
        fetchElementId(itemId);
      }
    });
  });
}

window.onload = function onload() { 
  addToCart();
  getApi();
  tookElements();
  getSkuFromProductItem();
};
