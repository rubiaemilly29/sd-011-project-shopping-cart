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

function getSkuFromProductItem(item) { // função auxiliar fornecida
  return item.querySelector('span.item__sku').innerText;
}

function saveCart() {
  const cart = document.querySelector('ol').innerHTML;
  localStorage.setItem('cartItems', cart);
}

function sumPrices() {
  const cart = document.querySelectorAll('.cart__item');
  let total = 0;
  cart.forEach((item) => {
    const price = item.innerText.split('$');
    total += parseFloat(price[1]);
  });
  document.querySelector('.total-price').innerHTML = `<p>${total}</p>`;
}

function cartItemClickListener(event) {
  const toRemove = event.target;
  toRemove.remove();
  saveCart();
  sumPrices();
}

function createCartItemElement({ sku, name, salePrice }) { // função auxiliar fornecida
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchAndReturnJson(url) {
  const productList = await fetch(url);
  return productList.json();
}

async function createItemSection() {
  const itemsSection = document.querySelector('.items');
  const productsList = (
    await fetchAndReturnJson('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  );
  productsList.results.forEach((object) => {
    const productResume = {
      sku: object.id,
      name: object.title,
      image: object.thumbnail,
    };
    itemsSection.appendChild(createProductItemElement(productResume));
  });
}

async function addToCart(event) {
    const sku = getSkuFromProductItem(event.target.parentNode);
    const selectedProduct = await fetchAndReturnJson(`https://api.mercadolibre.com/items/${sku}`);
    const product = {
      sku: selectedProduct.id,
      name: selectedProduct.title,
      salePrice: selectedProduct.price,
    };
    await document.querySelector('.cart__items').appendChild(createCartItemElement(product));
    saveCart();
    sumPrices();
}

function retrieveCart() {
  const cart = localStorage.getItem('cartItems');
  document.querySelector('.cart__items').innerHTML = cart;
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((item) => item.addEventListener('click', cartItemClickListener));
  sumPrices();
}

window.onload = function onload() {
  createItemSection();
  const itemsSection = document.querySelector('.items');
  itemsSection.addEventListener('click', addToCart);
  retrieveCart();
};
