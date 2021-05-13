// const fetch = require('node-fetch');
// window.onload = function onload() {};

const sectionItems = document.getElementById('sectionItems');
const myObj = {
  method: 'GET',
  headers: { Accept: 'application/json' },
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

const productMLArray = async () => {
  const ML_ARRAY = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const parseJson = (el) => el.json();
  const product = await fetch(ML_ARRAY, myObj);
  const jsonProduct = await parseJson(product);
  return jsonProduct.results;
};

const getProductKeys = async (product) => {
  const importedProduct = await product();
  importedProduct.forEach((el) => {
    const idObj = {
      sku: el.id,
      name: el.title,
      image: el.thumbnail,
    };
    sectionItems.appendChild(createProductItemElement(idObj));
  });
};

getProductKeys(productMLArray);

const productMLItem = async (itemId) => {
  const ML_ITEM = `https://api.mercadolibre.com/items/${itemId}`;
  const parseJson = (el) => el.json();
  const product = await fetch(ML_ITEM, myObj);
  const jsonProduct = await parseJson(product);
  return console.log(jsonProduct);
};
productMLItem('MLB1341706310');
