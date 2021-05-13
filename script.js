const apiProducts = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

async function apiProductsRequest() {
  return fetch(apiProducts)
  .then((data) => data.json())
  .then((data) => data.results);
}

async function apiItemRequest(itemID) {
  return fetch(`https://api.mercadolibre.com/items/${itemID}`)
  .then((data) => data.json());
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemOL(event) {
  const itemID = event.target.parentNode.firstChild.innerText;
  const itemData = await apiItemRequest(itemID);
  const { id: sku, title: name, price: salePrice } = itemData;
  const listOl = document.querySelector('.cart__items');
  listOl.appendChild(createCartItemElement({ sku, name, salePrice }));
}

async function displayProducts() {
  const apiData = await apiProductsRequest();
  const productsSection = document.querySelector('.items');

  apiData.forEach((product) => {
    const { id: sku, title: name, thumbnail_id: imagem } = product;
    const image = `http://http2.mlstatic.com/D_${imagem}-I.jpg`;

    productsSection.appendChild(createProductItemElement({ sku, name, image }));
  });

  const btnAdd = document.querySelectorAll('.item__add');
  btnAdd.forEach((element) => element.addEventListener('click', addItemOL));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() { 
  displayProducts();
};
