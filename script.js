window.onload = function onload() { };

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
  const options = {};
  const url = `https://api.mercadolibre.com/items/${itemId}`;
  return fetch(url, options)
  .then((response) => response.json())
  .then((data) => data)
  .catch((error) => console.error(error));
};

const removeElementFromStorage = (string) => {
  const deleteId = string.split(' | ')[0].split(' ')[1];
  
  let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));
  const deleteItem = shoppingCart.find(({ id }) => id === deleteId);
  shoppingCart = shoppingCart.filter((item) => item !== deleteItem);

  localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
};

function cartItemClickListener({ target }) {
  removeElementFromStorage(target.innerText);
  target.parentElement.removeChild(target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemToLocalStorage = ({ id, title, price }) => {
  const newItem = { id, title, price };

  const shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));

  if (shoppingCart) shoppingCart.push(newItem);

  localStorage.setItem(
    'shoppingCart',
    shoppingCart ? JSON.stringify(shoppingCart) : JSON.stringify([newItem]),
  );
};

async function addItemToCart({ target }) {
  const itemId = getSkuFromProductItem(target.parentElement);

  const item = await fetchItem(itemId);

  addItemToLocalStorage(item);

  const cartItemsOl = document.querySelector('ol.cart__items');
  cartItemsOl.appendChild(createCartItemElement(item));
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
  const options = {};
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  return fetch(url, options)
    .then((response) => response.json())
    .then(({ results }) => results)
    .catch((error) => console.error(error));
};

const addItems = async () => {
  const items = await fetchComputerItems();
  
  const itemsContainer = document.querySelector('section.items');
  
  items.forEach((item) => itemsContainer.appendChild(createProductItemElement(item)));
};

const loadCartFromStorage = () => {
  const storageItems = JSON.parse(localStorage.getItem('shoppingCart'));

  const cartItemsOl = document.querySelector('ol.cart__items');

  if (storageItems) {
    storageItems.forEach((item) => cartItemsOl.appendChild(createCartItemElement(item)));
  }
};

const onLoad = () => {
  addItems();
  loadCartFromStorage();
};

window.onload = onLoad;
