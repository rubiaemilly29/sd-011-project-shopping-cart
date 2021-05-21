let cart;
let cartItems;
let itemsContainer;
let cartPricesArray = [];
let cartPriceAmount = 0;
let totalCartPriceElement;
const targetKey = 'Cart Products';

function updateRenderCartPrice() {
  const stringOfCartPrice = JSON.stringify(cartPriceAmount);
  const decimalPoints = stringOfCartPrice.split('.')[1];
  if (decimalPoints === undefined) {
    totalCartPriceElement.innerText = stringOfCartPrice;
  } else {
    let priceWithDecimalPoints;
    switch (decimalPoints.length) {
      case 1:
        priceWithDecimalPoints = cartPriceAmount.toFixed(1);
      break;  
      default:
        priceWithDecimalPoints = cartPriceAmount.toFixed(2);
      break;
    }
    totalCartPriceElement.innerText = priceWithDecimalPoints;
  }
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
  const priceContainer = createCustomElement('p', 'price-container', 'Total Price: $');
  totalCartPriceElement = createCustomElement('span', 'total-price', totalPrice);

  priceContainer.appendChild(totalCartPriceElement);

  cart.appendChild(priceContainer);
}

function calculateCartPrice() {
  const rawCartPriceAmount = cartPricesArray
    .reduce((previous, current) => previous + current, 0);

  cartPriceAmount = +rawCartPriceAmount;

  updateRenderCartPrice();
}

function removeItemFromArray(termToRemove, fromArray) {
  const indexOfItemToRemove = fromArray.indexOf(termToRemove);
  
  fromArray.splice(indexOfItemToRemove, 1);
}

function removeFromTotalPrices(targetPrice) {
  removeItemFromArray(targetPrice, cartPricesArray);

  calculateCartPrice();
}

function extractInfoFromString(string, targetInfo) {
  if (targetInfo === 'price') return string.split('$')[1];
  if (targetInfo === 'id') return string.split(' ', 13)[1];
  return null;
}

function setToLocalStorage(productSKU) {
  const cartItemsInStorage = localStorage.getItem(targetKey);
  let cartItemsArr;
  if (cartItemsInStorage) {
    cartItemsArr = JSON.parse(cartItemsInStorage);
    cartItemsArr.push(productSKU);
  } else {
    cartItemsArr = [productSKU];
  }

  localStorage.setItem(targetKey, JSON.stringify(cartItemsArr));
}

function removeFromLocalStorage(productSKU) {
  const cartItemsInString = localStorage.getItem(targetKey);
  let localStorageCartItems = JSON.parse(cartItemsInString);

  removeItemFromArray(productSKU, localStorageCartItems);

  localStorageCartItems = JSON.stringify(localStorageCartItems);

  if (localStorageCartItems === '[]') localStorage.clear(targetKey);
  else localStorage.setItem(targetKey, localStorageCartItems);
}

function cartItemClickListener(event) {
  const thisElement = event.target;
  
  const fullString = thisElement.innerText;
  const price = extractInfoFromString(fullString, 'price');
  const sku = extractInfoFromString(fullString, 'id');
  
  cartItems.removeChild(thisElement);

  removeFromTotalPrices(+price);
  removeFromLocalStorage(sku);

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

async function fetchSingleItem(singleItemId) {
  const fetchedSingleItem = await fetch(`https://api.mercadolibre.com/items/${singleItemId}`);
  const response = await fetchedSingleItem.json();
  const singleItemJson = await response;

  const { id, title, price } = singleItemJson;
  const singleItemElement = createCartItemElement({ sku: id, name: title, salePrice: price });

  cartPricesArray.push(price);

  calculateCartPrice();

  cartItems.appendChild(singleItemElement);
}

function addItemToCart(event) {
  const item = event.target.parentNode;
  const id = getSkuFromProductItem(item);

  setToLocalStorage(id);
  fetchSingleItem(id);
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

  localStorage.clear(targetKey);

  calculateCartPrice();
  updateRenderCartPrice();
}

function createLoadingElement() {
  const loadingElement = createCustomElement('div', 'loading', 'Loading...');
  loadingElement.style.fontSize = '80px';

  return loadingElement;
}

function renderCartFromLocalStorage() {  
  if (localStorage.getItem(targetKey)) {
    const localStorageCartItems = JSON.parse(localStorage.getItem(targetKey));
    localStorageCartItems.forEach((sku) => fetchSingleItem(sku));
  }
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
  renderCartFromLocalStorage();
};
