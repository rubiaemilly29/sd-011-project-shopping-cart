sessionStorage.setItem('total', 0);
const storageCart = localStorage;

/* |||||||||||||||||| CONSERTAR PROBLEMAS DE ESCOPO  DO CART E TOTAL  |||||||||||||||||||
 const total = document.querySelectorAll('.total-price');
 const cart = document.querySelector('.cart__items');
||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */

const removeItens = () => {
  // ####################################### VERIFICAR ESSA DECLARAÇÃO NO ESCOPO GLOBAL (REPETE 3x) [ESSA NAO DEU CERTO]
  const totalInCart = document.querySelector('#clear-cart');
  // #######################################
  // ####################################### VERIFICAR ESSA DECLARAÇÃO NO ESCOPO GLOBAL (REPETE 4x) [ESSA NAO DEU CERTO]
  const cart = document.querySelector('#cart__items');
  // #######################################
  localStorage.clear();
  sessionStorage.clear();
  totalInCart.innerText = 'Preço total: $0';
  const cartItems = cart.children;
  for (let item = cartItems.length; item > 0; item -= 1) cart.removeChild(cartItems[0]);
};

function cartItemClickListener(event) {
  // HTML Element with total value
  // ####################################### VERIFICAR ESSA DECLARAÇÃO NO ESCOPO GLOBAL [ESSA NAO DEU CERTO]
  const total = document.querySelector('.total-price');
  // ####################################### 
  // selecting  local storage item by className(id)
  let item = localStorage.getItem(event.target.classList[1]);
  item = JSON.parse(item).price;
  const sessionStorageTotal = Number(sessionStorage.getItem('total'));

  const cartToRemoveChild = document.querySelector('#cart__items');
  localStorage.removeItem(`${event.target.classList[1]}`);

  const newTotal = parseFloat(sessionStorageTotal - item).toFixed(2);
  sessionStorage.setItem('total', newTotal);
  total.innerHTML = `${newTotal}`;
  cartToRemoveChild.removeChild(event.target);
}

function createCartItemElement({ id, title, price }) {
  const totalInCart = document.querySelector('.total-price');
  // getting total value of session storage
  const totalValueInCart = Number(sessionStorage.getItem('total'));
  // create object to stringify and save in storage
  const itemToSaveInStore = {
    id,
    title,
    price,
  };
  const li = document.createElement('li');
  li.className = `cart__item ${id}`;
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  localStorage.setItem(`${id}`, JSON.stringify(itemToSaveInStore));
  sessionStorage.setItem('total', parseInt(totalValueInCart + price));
  totalInCart.innerHTML = `${parseInt(totalValueInCart + price)}`;
  return li;
}

async function addItemToCart(event) {
  const ITEM = event.path[1].children[0].innerText;
  const cart = document.querySelector('.cart__items');

  const itemInfo = await fetch(`https://api.mercadolibre.com/items/${ITEM}`);
  const data = await itemInfo.json();
  const { id, title, price } = data;
  cart.appendChild(createCartItemElement({ id, title, price }));
}

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const ALL_PRODUCTS = async () => {
  const productsContainer = document.querySelector('.items');
  const QUERY = 'computador';
  const data = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
  const allProducts = await data.json();

  allProducts.results.forEach((product) => {
    const { id, title, thumbnail } = product;
    const section = document.createElement('section');
    section.className = 'item';
    productsContainer.appendChild(createProductItemElement({ id, title, thumbnail }));
  });
  const addToCartButton = document.querySelectorAll('button.item__add');
  addToCartButton.forEach((button) => button.addEventListener('click', addItemToCart));
};

window.onload = async function onload() {
  ALL_PRODUCTS();
  // AFTER LOAD, CHECK AND CREATE SAVED ITENS IN LOCALSTORAGE
  const cart = document.querySelector('.cart__items');
  const itemsInStorage2 = Object.values(storageCart);

  itemsInStorage2.forEach((item) => {
    const itemInStorage = JSON.parse(item);
    cart.appendChild(createCartItemElement(itemInStorage));
  });
  const buttonClearCart = document.querySelector('.empty-cart');
  buttonClearCart.addEventListener('click', removeItens);
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }