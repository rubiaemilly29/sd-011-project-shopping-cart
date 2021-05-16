const mainOrdenedList = '.cart__items';
const anyItemOfList = '.cart__item';
const createDiv = document.createElement('div');

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

// Função responsável por somar os preços das coisas adicionadas ao carrinho!
function sumProducts() {
  const toSum = document.querySelectorAll(anyItemOfList);
  let totalSum = 0;

  toSum.forEach((item) => {
    const catchedText = item.innerText;
    totalSum += parseFloat(catchedText.split('$')[1]);
  });
  const displayPrice = document.querySelector('.total-price');
  displayPrice.innerText = totalSum;
}

function emptyCart() {
  const empytButton = document.querySelector('.empty-cart');
  empytButton.addEventListener('click', () => {
    const cartProducts = document.querySelectorAll(anyItemOfList);
    cartProducts.forEach((item) => {
      item.remove();
    });
    sumProducts();
    const cartItems = document.querySelector(mainOrdenedList).innerHTML;
    localStorage.setItem('cartItems', cartItems);
  });
}

function cartItemClickListener(event) {
  event.target.remove();
  const cartItems = document.querySelector(mainOrdenedList).innerHTML;
  localStorage.setItem('cartItems', cartItems);
  sumProducts();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCartButton = () => {
  const addButtons = document.querySelectorAll('.item__add');
  const ordenedList = document.querySelector(mainOrdenedList);
  addButtons.forEach((addButton) => {
    addButton.addEventListener('click', async () => {
      const productId = addButton.parentNode.firstElementChild.innerText;
      const idResult = await fetch(`https://api.mercadolibre.com/items/${productId}`);
      const resultOfId = await idResult.json();
      const idProduct = createCartItemElement(resultOfId);
      ordenedList.appendChild(idProduct);

      localStorage.setItem('cartItems', ordenedList.innerHTML);
      sumProducts();
    });
  });
};

// Função responsável por deixar algumas execuções na fila de espera.
async function fetchItems() {
  const API = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const resultOfProducts = await API.json();
  const productContainers = document.querySelector('.items');

  resultOfProducts.results.forEach((element) => {
    const anyProduct = createProductItemElement(element);
    productContainers.appendChild(anyProduct);
  });

  addCartButton();
  emptyCart();
  document.querySelector('.loading').remove();
}

window.onload = function onload() {
  fetchItems();
  const cartItems = document.querySelector(mainOrdenedList);
  if (localStorage.cartItems) {
    cartItems.innerHTML = localStorage.getItem('cartItems');
    const cartItem = document.querySelectorAll(anyItemOfList);
    cartItem.forEach((product) => {
      product.addEventListener('click', cartItemClickListener);
    });
    sumProducts();
  }
};
