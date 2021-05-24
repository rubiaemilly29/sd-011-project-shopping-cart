const totalPrice = document.querySelector('.total-price');

function addLocalStorage() {
  const getCart = document.querySelector('ol').innerHTML;
  localStorage.setItem('cartItems', getCart);
}

function getLocalStorage() {
  const getCart = document.querySelector('ol');
  getCart.innerHTML = localStorage.getItem('cartItems');
}

function eraseCart() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    const cartItems = document.querySelector('ol');
    while (cartItems.hasChildNodes()) {
      cartItems.removeChild(cartItems.firstChild);
    }
    totalPrice.innerText = 0;
  });
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

function cartItemClickListener(event, salePrice) {
  document.querySelector('ol').removeChild(event.target);
  totalPrice.innerText = Number(totalPrice.innerText) - salePrice;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, salePrice));
  totalPrice.innerText = Number(totalPrice.innerText) + salePrice;
  return li;
}

function listOfItems(item) {
  return {
    sku: item.id,
    name: item.title,
    image: item.thumbnail,
  };
}

function renderComputers(computers) {
  const listOfProducts = document.querySelector('.items');
  computers.forEach((computer) => listOfProducts.appendChild(createProductItemElement(computer)));
}

function getDataFromApi() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((items) => items.results.map((item) => listOfItems(item)))
    .then((computers) => renderComputers(computers));
}

function renderCart(items) {
  const listOfProducts = document.querySelector('.cart__items');
  return listOfProducts.appendChild(createCartItemElement(items));
}

function addProduct(event) {
  const itemID = getSkuFromProductItem(event.target.parentNode);
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((response) => response.json())
    .then((json) => {
      const product = {
        sku: json.id,
        name: json.title,
        salePrice: json.price,
      };
      renderCart(product);
    })
    .then(() => addLocalStorage());
}

window.onload = function onload() { 
  getDataFromApi();
  getLocalStorage();
  document.querySelector('.items').addEventListener('click', addProduct);
  eraseCart();
};