const storageCart = localStorage;

window.onload = async function onload() {
  ALL_PRODUCTS();

  // AFTER LOAD, CHECK AND CREATE SAVED ITENS IN LOCALSTORAGE
  const cart = document.querySelector('.cart__items');
  Object.entries(storageCart).forEach((item) => {
    const id = item[0];
    const title = JSON.parse(item[1]).title;
    const price = JSON.parse(item[1]).price;
    cart.appendChild(createCartItemElement({ id, title, price }));
  });
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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // HTML Element with total value
  const total = document.querySelector('.total-price');
  // selecting  local storage item by className(id)
  let item = localStorage.getItem(event.target.classList[1])
  item = JSON.parse(item).price;
  let sessionStorageTotal = Number(sessionStorage.getItem('total'))

  const cart = document.querySelector('.cart__items');
  localStorage.removeItem(`${event.target.classList[1]}`);

  const newTotal = (sessionStorageTotal - item)
  sessionStorage.setItem('total', newTotal)
  total.innerHTML = `Preço total: ${newTotal}`
  cart.removeChild(event.target);
}

const TOTAL_IN_CART = sessionStorage.setItem('total', 0);
function createCartItemElement({ id, title, price }) {
  const total = document.querySelector('.total-price');
  // getting total value of session storage
  let totalValueInCart = Number(sessionStorage.getItem('total'))
  // create object to stringify and save in storage
  const itemToSaveInStore = {
    title,
    price,
  };
  const li = document.createElement('li');
  li.className = `cart__item ${id}`;
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  localStorage.setItem(`${id}`, JSON.stringify(itemToSaveInStore));
  sessionStorage.setItem('total', parseFloat(totalValueInCart + price).toFixed(2));
  total.innerHTML = `Preço total: ${parseFloat(totalValueInCart + price).toFixed(2)}`;
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

const ALL_PRODUCTS = async () => {
  const productsContainer = document.querySelector('.items');
  const QUERY = 'computador';
  const data = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
  const allProducts = await data.json();

  allProducts.results.forEach((product) => {
    const section = document.createElement('section');
    section.className = 'item';
    productsContainer.appendChild(createProductItemElement({ id, title, thumbnail } = product));
  });
  const addToCartButton = document.querySelectorAll('button.item__add');
  addToCartButton.forEach((button) => button.addEventListener('click', addItemToCart));
};