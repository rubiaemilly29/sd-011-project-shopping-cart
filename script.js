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

const createLoading = (selector) => {
  const container = document.querySelector(selector);
  const loading = document.createElement('span');
  loading.classList.add('loading');
  loading.innerText = 'loading...';
  container.appendChild(loading);

  return [container, loading];
};

const removeLoading = (container, loading) => {
  container.removeChild(loading);
};

const fetchItem = (itemId) => {
  const [container, loading] = createLoading('.cart__items');
  return fetch(`https://api.mercadolibre.com/items/${itemId}`, {})
  .then((response) => response.json())
  .then((data) => {
    removeLoading(container, loading);
    return data;
  })
  .catch((error) => console.error(error));
};

const removeFromElementStorage = (string) => {
  const idDelete = string.split(' | ')[0].split(' ')[1];

  let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));
  const deleteItem = shoppingCart.find(({ id }) => id === idDelete);
  shoppingCart = shoppingCart.filter((item) => item !== deleteItem);

  localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
};

const getCartPriceSum = () => {
  let sum = 0;
  const itemsCart = JSON.parse(localStorage.getItem('shoppingCart'));

  sum = itemsCart ? itemsCart.reduce((acc, { price }) => acc + price, 0) : 0;
  return sum;
};

const totPrice = () => {
  const totalPrice = document.querySelector('.total-price');

  if (totalPrice) totalPrice.parentElement.removeChild(totalPrice);

  const newSpan = document.createElement('span');
  newSpan.classList.add('total-price');
  newSpan.innerText = getCartPriceSum();

  document.querySelector('.cart').appendChild(newSpan);
};

function cartItemClickListener({ target }) {
  removeFromElementStorage(target.innerText);
  target.parentElement.removeChild(target);
  totPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemToStorage = ({ id, title, price }) => {
  const itemNew = { id, title, price };

  const shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));

  if (shoppingCart) shoppingCart.push(itemNew);

  localStorage.setItem(
    'shoppingCart',
    shoppingCart ? JSON.stringify(shoppingCart) : JSON.stringify([itemNew]),
  );
};

async function addItemToCart({ target }) {
  const item = await fetchItem(getSkuFromProductItem(target.parentElement));

  addItemToStorage(item);

  document.querySelector('.cart__items').appendChild(createCartItemElement(item));

  totPrice();
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  const addItemButton = createCustomElement('button', 'item__add', 'Adcionar ao carrinho!');
  addItemButton.addEventListener('click', addItemToCart);

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(addItemButton);

  return section;
}

const fetchItems = () => {
  const [container, loading] = createLoading('.items');

  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', {})
    .then((response) => response.json())
    .then(({ results }) => {
      removeLoading(container, loading);
      return results;
    })
    .catch((error) => console.error(error));
};

const addItems = async () => {
  const items = await fetchItems();

  const itemsContainer = document.querySelector('.items');
  items.forEach((item) => itemsContainer.appendChild(createProductItemElement(item)));
};

const storageLoad = () => {
  const itemsStorage = JSON.parse(localStorage.getItem('shoppingCart'));

  const container = document.querySelector('.cart__items');
  
  if (itemsStorage) {
    itemsStorage.forEach((item) => container.appendChild(createCartItemElement(item))); 
  }
};

window.onload = function onload() {
  addItems();
  storageLoad();
  totPrice();
  document.querySelector('.empty-cart').addEventListener('click', () => {
    const container = document.querySelector('.cart__items');
    container.innerHTML = '';
    localStorage.removeItem('shoppingCart');
    totPrice();
  });
};
