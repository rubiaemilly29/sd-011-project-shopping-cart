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

const arrayToTotalPrice = [];

function sumPrice() {
  const classPrice = document.querySelector('.total-price');
  const soma = arrayToTotalPrice.reduce((acc, curr) => acc + curr, 0);
  classPrice.innerHTML = `${soma}`;
}

// Meu código
const cartItems = '.cart__items';
// Meu código
const addLocalStorage = () => {
  const cartListItens = document.querySelector(cartItems).innerHTML;
  localStorage.setItem('name', cartListItens);
};

// Meu código
const restoreLocalStorage = () => {
  const productItems = document.querySelector(cartItems);
  const item = localStorage.getItem('name');
  productItems.innerHTML = item;
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  arrayToTotalPrice.push(event.target.className * -1);
  event.target.remove();
  addLocalStorage();
  sumPrice();
}

function emptyCart() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const item = document.querySelector(cartItems);
    item.innerHTML = '';
    window.localStorage.clear();
    arrayToTotalPrice.length = 0;
    sumPrice();
  });
}

// Meu código

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = `${salePrice}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  arrayToTotalPrice.push(salePrice);
  return li;
}

// Meu código
async function addToCart(itemId) {
  const items = document.querySelector('.cart__items');
  const data = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const product = await data.json();
  const object = {
    sku: product.id,
    name: product.title,
    salePrice: product.price,
  };
  items.appendChild(createCartItemElement(object));
  addLocalStorage();
  sumPrice();
}

// Meu código
function clickEventToCart() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      // descobrir o id do item clicado e chamar o addToCart passando o ID
      const sku = getSkuFromProductItem(button.parentElement);
      addToCart(sku);
      addLocalStorage();
    });
  });
}

// Meu código
async function productList() {
  const section = document.querySelector('.items');
  const data = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const products = await data.json();
  products.results.forEach((item) => {
    const object = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
    section.appendChild(createProductItemElement(object));
  });
  clickEventToCart();
}

window.onload = function onload() {
  productList();
  restoreLocalStorage();
  emptyCart();
};