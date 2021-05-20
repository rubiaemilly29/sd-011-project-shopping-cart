let cart;
let cartItems;
let itemsContainer;
let cartPricesArray = [];
let cartPriceAmount = 0;
let totalCartPriceElement;

function updateRenderCartPrice() {
  totalCartPriceElement.innerText = cartPriceAmount;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  
  return e;
}

function renderCartPrice(totalPrice) {
  totalCartPriceElement = createCustomElement('span', 'total-price', totalPrice);

  cart.appendChild(totalCartPriceElement);
}

function calculateCartPrice() {
  cartPriceAmount = cartPricesArray.reduce((previous, current) => previous + current, 0);

  updateRenderCartPrice();
}

function removeFromTotalPrices(targetPrice) {
  cartPricesArray = cartPricesArray.filter((price) => price !== targetPrice);

  calculateCartPrice();
}

function cartItemClickListener(event) {
  const thisElement = event.target;
  
  const fullString = thisElement.innerText;
  const price = fullString.split('$')[1];
  
  cartItems.removeChild(thisElement);
  removeFromTotalPrices(+price);

  updateRenderCartPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  
  return li;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;

  return img;
}

async function addItemToCart(event) {
  const item = event.target.parentNode;
  const singleItemId = getSkuFromProductItem(item);

  const fetchSingleItem = await fetch(`https://api.mercadolibre.com/items/${singleItemId}`);
  const response = await fetchSingleItem.json();
  const singleItemJson = await response;

  const { id, title, price } = singleItemJson;
  const singleItemElement = createCartItemElement({ sku: id, name: title, salePrice: price });

  cartPricesArray.push(price);

  calculateCartPrice();

  cartItems.appendChild(singleItemElement);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');

  const addToCartBtn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addToCartBtn.addEventListener('click', addItemToCart);

  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  section.appendChild(addToCartBtn);

  return section;
}

function renderProductsList(productsArray) {
  const itemsSection = document.querySelector('.items');

  productsArray.map((singleProduct) => {
    const { id, title, thumbnail } = singleProduct;

    itemsSection.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));

    return singleProduct;
  });
}

function clearCart() {
  cartItems.innerHTML = '';

  cartPricesArray = [];

  calculateCartPrice();
  updateRenderCartPrice();
}

function createLoadingElement() {
  const loadingElement = createCustomElement('div', 'loading', 'Loading...');
  loadingElement.style.fontSize = '80px';

  return loadingElement;
}

window.onload = async function onload() {
  itemsContainer = document.querySelector('.items');
  cart = document.querySelector('.cart');
  cartItems = document.querySelector('.cart__items');
  document.querySelector('.empty-cart').addEventListener('click', clearCart);
  const loadingEl = createLoadingElement();

  itemsContainer.appendChild(loadingEl);
  
  const fetchML = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const response = await fetchML.json();
  const resultJson = await response;
  const { results } = resultJson;
  
  itemsContainer.removeChild(loadingEl);

  renderCartPrice(cartPriceAmount);
  renderProductsList(results);
};
