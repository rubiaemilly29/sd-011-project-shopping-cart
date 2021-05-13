window.onload = function onload() {
  addItems();
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const fetchItem = (itemId) => {
  const url = `https://api.mercadolibre.com/items/${itemId}`;
  return fetch(url, {})
  .then((response) => response.json())
  .then((data) => data)
  .catch((error) => console.error(error));
};

function cartItemClickListener({ target }) {
  target.parentElement.removeChild(target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemToCart = async ({ target }) => {
  const item = await fetchItem(getSkuFromProductItem(target.parentElement));

  document.querySelector('ol.cart__items').appendChild(createCartItemElement(item));
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  const addItemButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addItemButton.addEventListener('click', addItemToCart);

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(addItemButton);

  return section;
}

const fetchComputerItems = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  return fetch(url, {})
    .then((response) => response.json())
    .then(({ results }) => results)
    .catch((error) => console.error(error));
};

const addItems = async () => {
  const items = await fetchComputerItems();

  items.forEach((item) => document.querySelector('section.items').appendChild(createProductItemElement(item)));
};
