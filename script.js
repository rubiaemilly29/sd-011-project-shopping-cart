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
  const options = {};
  const url = `https://api.mercadolibre.com/items/${itemId}`;

  const [container, loadingSpan] = createLoadingSpan('.cart__items');

  return fetch(url, options)
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
  const cartSection = document.querySelector('section.cart');

  const totalPriceSpan = document.querySelector('.total-price');

  if (totalPriceSpan) totalPriceSpan.parentElement.removeChild(totalPriceSpan);

  const newSpan = document.createElement('span');
  newSpan.classList.add('total-price');
  newSpan.innerText = getCartPriceSum();

  cartSection.appendChild(newSpan);
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
  const itemId = getSkuFromProductItem(target.parentElement);

  const item = await fetchItem(itemId);

  addItemToLocalStorage(item);

  const cartItemsOl = document.querySelector('ol.cart__items');
  cartItemsOl.appendChild(createCartItemElement(item));

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

const fetchComputerItems = () => {
  const options = {};
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  const [container, loadingSpan] = createLoadingSpan('.items');

  return fetch(url, options)
    .then((response) => response.json())
    .then(({ results }) => {
      removeLoadingSpan(container, loadingSpan);
      return results;
    })
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

const clearCart = () => {
  const cartItemsOl = document.querySelector('.cart__items');
  cartItemsOl.innerHTML = '';
  localStorage.removeItem('shoppingCart');
  updateTotalPrice();
};

const onLoad = () => {
  addItems();
  loadCartFromStorage();
  updateTotalPrice();
  const clearCartButton = document.querySelector('.empty-cart');
  clearCartButton.addEventListener('click', clearCart);
};

window.onload = onLoad;
