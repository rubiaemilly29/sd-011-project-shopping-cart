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

const priceCalculator = () => {
  const cartItem = '.cart__item';
  const cartItemFromDocument = document.querySelectorAll(cartItem);
  let sum = 0;
  cartItemFromDocument.forEach((item) => {
    sum += parseFloat(item.textContent.split('$')[1]);
  });
  document.querySelector('.total-price').innerHTML = parseFloat(sum.toFixed(2));
};

function cartItemClickListener(event) {
  event.target.remove();
  priceCalculator();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addButtonEventListner(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json())
    .then((product) => {
      const receivedLi = createCartItemElement(product);
      const olFromDocument = document.querySelector('ol');
      olFromDocument.appendChild(receivedLi);
      localStorage.setItem('cartContent', olFromDocument.innerHTML);
      priceCalculator();
    });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', () => {
    addButtonEventListner(sku);
  });
  section.appendChild(button);
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

async function apiloading() {
  const API = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const resultOfProducts = await API.json();
  const products = document.querySelector('.items');
  resultOfProducts.results.forEach((element) => {
    const product = createProductItemElement(element);
    products.appendChild(product);
  });
}

function loadStorage() {
  const items = document.querySelector('ol');
  items.innerHTML = localStorage.getItem('cartContent');
  document.querySelectorAll('li').forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
    priceCalculator();
  });
}

const clear = () => {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    priceCalculator();
  });
};

const loadingAlert = () => {
  const load = document.createElement('span');
  load.className = 'loading';
  load.textContent = 'Loading...';
  const loadIv = document.querySelector('.loading');
  loadIv.appendChild(load);
};

const loadRemove = () => {
  document.querySelector('.loading').remove();
};

window.onload = async function onload() {
  loadingAlert();
  await apiloading();
  loadRemove();
  loadStorage();
  clear();
};
