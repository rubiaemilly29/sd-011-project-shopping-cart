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

const createLoadingSpan = (selector) => {
  const container = document.querySelector(selector);
  const loadingSpan = document.createElement('span');
  loadingSpan.classList.add('loading');
  loadingSpan.innerText = 'loading...';
  container.appendChild(loadingSpan);

  return [container, loadingSpan];
};

const removeLoadingSpan = (container, loadingSpan) => {
  container.removeChild(loadingSpan);
};

const fetchItem = (itemId) => {
  const [container, loadingSpan] = createLoadingSpan('.cart__items');

  return fetch(`https://api.mercadolibre.com/items/${itemId}`, {})
  .then((response) => response.json())
  .then((data) => {
    removeLoadingSpan(container, loadingSpan);
    return data;
  })
  .catch((error) => console.error(error));
};

const removeElementFromStorage = (string) => {
  const deleteId = string.split(' | ')[0].split(' ')[1];

  let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));
  const deleteItem = shoppingCart.find(({ id }) => id === deleteId);
  shoppingCart = shoppingCart.filter((item) => item !== deleteItem);

  localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
};

const getCartPriceSum = () => {
  let sum = 0;
  const cartItems = JSON.parse(localStorage.getItem('shoppingCart'));

  sum = cartItems ? cartItems.reduce((acc, { price }) => acc + price, 0) : 0;

  return sum;
};

const updateTotalPrice = () => {
  const totalPriceSpan = document.querySelector('.total-price');

  if (totalPriceSpan) totalPriceSpan.parentElement.removeChild(totalPriceSpan);

  const newSpan = document.createElement('span');
  newSpan.classList.add('total-price');
  newSpan.innerText = getCartPriceSum();

  document.querySelector('section.cart').appendChild(newSpan);
};

function cartItemClickListener({ target }) {
  removeElementFromStorage(target.innerText);
  target.parentElement.removeChild(target);
  updateTotalPrice();
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
  const item = await fetchItem(getSkuFromProductItem(target.parentElement));

  addItemToLocalStorage(item);

  document.querySelector('ol.cart__items').appendChild(createCartItemElement(item));

  updateTotalPrice();
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

const fetchItems = () => {
  const [container, loadingSpan] = createLoadingSpan('.items');

  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', {})
    .then((response) => response.json())
    .then(({ results }) => {
      removeLoadingSpan(container, loadingSpan);
      return results;
    })
    .catch((error) => console.error(error));
};

const addItems = async () => {
  const items = await fetchItems();
  const container = document.querySelector('section.items');
  items.forEach((item) => container.appendChild(createProductItemElement(item)));
};

const loadStorage = () => {
  const storageItems = JSON.parse(localStorage.getItem('shoppingCart'));
  const container = document.querySelector('ol.cart__items');
  if (storageItems) {
    storageItems.forEach((item) => container.appendChild(createCartItemElement(item)));
  }
};

window.onload = function onload() {
  addItems();
  loadStorage();
  updateTotalPrice();
  document.querySelector('.empty-cart').addEventListener('click', () => {
    const container = document.querySelector('.cart__items');
    container.innerHTML = '';
    localStorage.removeItem('shoppingCart');
    updateTotalPrice();
  });
};
