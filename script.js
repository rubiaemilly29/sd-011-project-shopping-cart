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

function getJSON(url, data = {}) {
  return fetch(url, data)
  .then((response) => response.json());
}

async function addCart(sku) {
  const element = document.querySelector('.cart__items');
  const item = await getJSON(`https://api.mercadolibre.com/items/${sku}`);
  const product = { sku: item.id, name: item.title, salePrice: item.price };
  const section = createCartItemElement(product);
  section.addEventListener('click', () => {
    localStorage.removeItem(sku);
    section.remove();
  });
  element.appendChild(section);
  localStorage[sku] = sku;
}

function loadCart() {
  Object.keys(localStorage).forEach((key) => {
    addCart(key);
  });
}

async function addItems(query) {
  const element = document.querySelector('.items');
  const { results } = await getJSON(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  results.forEach((result) => {
    const product = { sku: result.id, name: result.title, image: result.thumbnail };
    const section = createProductItemElement(product);
    section.addEventListener('click', () => addCart(product.sku));
    element.appendChild(section);
  });
}

window.onload = function onload() {
  addItems('computador');
  loadCart();
};
