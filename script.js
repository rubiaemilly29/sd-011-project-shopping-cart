const fetchApi = () => {
  const endPoint = "https://api.mercadolibre.com/sites/MLB/search?q=computador";
  const param = { headers: { Accept: 'application/json' } };
  return new Promise((resolve, reject) => {
  fetch(endPoint, param)
  .then(response => resolve(response.json()))
  .catch(error => reject(error));
  })
}

const reduceResponse = (acc, curr) => {
  acc.id = curr.id;
  acc.title = curr.title;
  acc.thumbnail = curr.thumbnail;
  return acc
}

const formatApiResults = (resp) => {
  const values = Object.values(resp);
  const control = values.map(el => ({
    sku: el.id, 
    name: el.title,
    image: el.thumbnail 
  }));
  return control;
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

const getAndCreateElements = () => {
  const items = document.querySelector('.items');
  fetchApi()
  .then(response => formatApiResults(response.results))
  .then(formated => formated.forEach((el) => items.appendChild(createProductItemElement(el))));
}

window.onload = function onload() {
  getAndCreateElements()
};
