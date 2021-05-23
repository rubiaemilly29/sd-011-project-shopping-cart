const cartItem = '.cart__item';

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

const insertLoading = () => {
  const parentNode = document.querySelector('.cart');
  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerText = 'Loading';
  parentNode.appendChild(loading);
};

const removeLoading = () => {
  const parentNode = document.querySelector('.cart');
  const loading = document.querySelector('.loading');
  parentNode.removeChild(loading);
};

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
  return item.querySelector('.item__sku').innerText;
}

// const getCartList = () => document.querySelectorAll('.cart__item');

// requisito 5
const sumAll = async () => {
  const itemsCart = document.querySelectorAll(cartItem);
  // const itemsArr = Array.from(document.querySelectorAll('.cart__item')); // array de elementos html (li)
  const price = document.querySelector('.total-price');
  // const total = itemsArr.reduce((acc, item) => acc + Number(item.innerText.split('$')[1]), 0);
  let sum = 0;
  itemsCart.forEach((item) => {
    sum += Number(item.innerText.split('$')[1]);
    return sum;
  });
  price.innerText = `Preço Total: $${sum.toFixed(2)}`;
};

function cartItemClickListener(event) {
  // requisito 3
  const cartList = document.querySelector('.cart__items');
  cartList.removeChild(event.target);
  // requisito 4
  localStorage.setItem('cartList', cartList.innerHTML);
  // requisito 5
  sumAll();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// requisito 1
const fetchProducts = async () => {
  insertLoading();
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  removeLoading();
  const json = await response.json();
  const products = await json.results;
  return products;
};

// requisito 2
const fetchItem = async (id) => {
  insertLoading();
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  removeLoading();
  const product = await response.json();
  return product;
};

// requisito 1
const createProductList = async () => {
  const prods = await fetchProducts();
  const items = document.querySelector('.items');
  prods.forEach(({ id, title, thumbnail }) => {
    const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
    items.appendChild(item);
  });
};

const catchItem = async (event) => {
  const itemID = getSkuFromProductItem(event.target.parentElement); // catch product id
  const prodList = document.querySelector('.cart__items');
  const prod = await fetchItem(itemID);
  const item = createCartItemElement({ sku: prod.id, name: prod.title, salePrice: prod.price });
  prodList.appendChild(item);
  // requisito 4
  localStorage.setItem('cartList', prodList.innerHTML); // salva localmente a lista de produtos selecionados
  // requisito 5
  sumAll();
};

const addCartItemAndCreateProductList = async () => {
  await createProductList();
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', catchItem));
}; 

const loadLocalStorage = () => {
  // requisito 4 - se houver lista no stoge, insere na OL e adiciona o addEventListener
  if (localStorage.getItem('cartList')) {
    const cartListOL = document.querySelector('ol.cart__items');
    cartListOL.innerHTML = localStorage.getItem('cartList');
    const cartListProducts = document.querySelectorAll(cartItem);
    cartListProducts.forEach((item) => item.addEventListener('click', cartItemClickListener));
  }
  // requisito 5
  sumAll();
};

// requisito 6
const removeAll = () => {
  const items = document.querySelectorAll(cartItem);
  items.forEach((item) => item.parentNode.removeChild(item));
  // requisitos 4 e 5
  localStorage.removeItem('cartList');
  sumAll();
};

const removeAllButton = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', removeAll);
};

window.onload = function onload() { 
  addCartItemAndCreateProductList();
  loadLocalStorage();
  removeAllButton();
};