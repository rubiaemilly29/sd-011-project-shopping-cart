const sectionItems = document.getElementById('sectionItems');
const cartItems = document.querySelector('.cart__items');
const totalPrice = document.querySelector('#spanPrice');
const emptyCart = document.querySelector('.empty-cart');

const clearCartItems = () => {
  emptyCart.addEventListener('click', (el) => {
    cartItems.innerHTML = '';
    totalPrice.innerText = 0;
    localStorage.items = cartItems.innerHTML;
    localStorage.totalPrice = totalPrice.innerText;
  });
};

clearCartItems();

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

const productMLItem = async (itemId) => {
  const ML_ITEM = `https://api.mercadolibre.com/items/${itemId}`;
  const parseJson = (el) => el.json();
  const product = await fetch(ML_ITEM);
  const jsonProduct = await parseJson(product);
  return jsonProduct;
};

const updatePrices = (delta) => {
  const sum = parseFloat(totalPrice.innerText) + delta;
  totalPrice.innerText = Math.round(sum * 100) / 100;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  const dataPrice = parseFloat(event.target.dataset.price);
  updatePrices(-dataPrice);
  removeFromStorage(event.target.dataset.id);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.dataset.price = salePrice;
  li.dataset.id = sku;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

const addItemToCart = (item) => {
  cartItems.appendChild(createCartItemElement(item));
  updatePrices(item.price);
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.querySelector('.item__add').addEventListener('click', handleProductClick);
  return section;
}

const productMLArray = async () => {
  const ML_ARRAY = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const parseJson = (el) => el.json();
  const product = await fetch(ML_ARRAY);
  const jsonProduct = await parseJson(product);
  return jsonProduct.results;
};

const exportProductsToPage = async (product) => {
  const importedProduct = await product();
  importedProduct.forEach((el) => {
    sectionItems.appendChild(createProductItemElement(el));
  });
};

exportProductsToPage(productMLArray);

const handleProductClick = async (event) => {
  const itemId = getSkuFromProductItem(event.target.parentNode);
  const item = await productMLItem(itemId);
  addItemToCart(item);
  saveStorage(item);
};

const saveStorage = ({ id, title, price }) => {
  let stored = localStorage.items;
  if (!stored) {
    stored = [];
  } else {
    stored = JSON.parse(stored);
  }
  stored.push({ id, title, price });
  localStorage.items = JSON.stringify(stored);
};

const removeFromStorage = (id) => {
  let stored = localStorage.items;
  if (!localStorage.items) {
    return;
  }
  stored = JSON.parse(stored);
  stored = stored.filter((el) => el.id !== id);
  localStorage.items = JSON.stringify(stored);
};

window.onload = () => {
  if (typeof localStorage.items !== 'undefined') {
    const loadedCartItems = JSON.parse(localStorage.items);
    loadedCartItems.forEach((item) => addItemToCart(item));
  }
};
