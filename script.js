const sectionItems = document.getElementById('sectionItems');
const cartItems = document.querySelector('.cart__items');
const totalPrice = document.querySelector('#spanPrice');
const emptyCart = document.querySelector('.empty-cart');

const myObj = {
  method: 'GET',
  headers: { Accept: 'application/json' },
};

const clearCart = () => {
  emptyCart.addEventListener('click', () => {
    cartItems.innerHTML = '';
    totalPrice.innerText = 0;
    localStorage.items = cartItems.innerHTML;
    localStorage.totalPrice = totalPrice.innerText;
  });
};

clearCart();

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
  const product = await fetch(ML_ITEM, myObj);
  const jsonProduct = await parseJson(product);
  return jsonProduct;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const dataPrice = event.target.getAttribute('data-price');
  const price = parseFloat(localStorage.totalPrice).toFixed(2);
  totalPrice.innerText = (price - dataPrice).toFixed(2);
  event.target.remove();
  localStorage.totalPrice = totalPrice.innerText;
  localStorage.items = cartItems.innerHTML;

  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.setAttribute('data-price', salePrice);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemToCart = async (el) => {
  const itemId = await getSkuFromProductItem(el.target.parentNode);
  const item = await productMLItem(itemId);
  cartItems.appendChild(createCartItemElement(item));
  const price = parseFloat(totalPrice.innerText);
  totalPrice.innerText = (price + item.price).toFixed(2);
  localStorage.totalPrice = totalPrice.innerText;
  localStorage.items = cartItems.innerHTML;
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.querySelector('.item__add').addEventListener('click', (el) => addItemToCart(el));
  return section;
}

const productMLArray = async () => {
  const ML_ARRAY = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const parseJson = (el) => el.json();
  const product = await fetch(ML_ARRAY, myObj);
  const jsonProduct = await parseJson(product);
  return jsonProduct.results;
};

const exportProductsToPage = async (product) => {
  const importedProduct = await product();
  importedProduct.forEach((el) => {
    sectionItems.appendChild(createProductItemElement(el));
  });
};

window.onload = () => {
  exportProductsToPage(productMLArray);
  if (localStorage.items && localStorage.totalPrice) {
    cartItems.innerHTML = localStorage.items;
    totalPrice.innerText = localStorage.totalPrice;
  }
};
