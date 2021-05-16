const paramJSON = { headers: { Accept: 'application/json' } };
const arrayOfShoppedItems = [];
const cartItemsContainer = '.cart__items';

function sumCart() {
  const getTotal = document.querySelector('.total-price');
  const sumArrayOfCart = Math.round(arrayOfShoppedItems.reduce((a, b) => a + b, 0) * 100) / 100;
  getTotal.innerText = sumArrayOfCart;
}

function getProductList() {
  const APIurl = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  return fetch(APIurl, paramJSON)
    .then((response) => response.json())
    .then((json) => (json.results
      .map(({ id, title, thumbnail }) => ({ sku: id, name: title, image: thumbnail }))));
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

function loopCreateElement(array) {
  const getItemsSection = document.querySelector('.items');
  array.forEach((element) => getItemsSection.appendChild(createProductItemElement(element)));
}

function saveToLocalStorage(key, value) {
  window.localStorage.setItem(key, value);
}

function removeElementFromLocalStorage(key) {
  localStorage.removeItem(key);
}

function cartItemClickListener(event) {
  const thisElement = event.target;
  arrayOfShoppedItems.push(thisElement.classList[0] * -1);
  thisElement.parentNode.removeChild(thisElement);
  removeElementFromLocalStorage(thisElement.id);
  sumCart();
}

function createCartItemElement({ sku, name, salePrice }, parentContainer) {
  const countNodesOfParentContainer = parentContainer.childElementCount + 1;
  const li = document.createElement('li');
  li.classList.add(salePrice);
  li.classList.add(sku);
  li.id = `shop-item-${countNodesOfParentContainer}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  arrayOfShoppedItems.push(salePrice);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function insertItemToCart(object) {
  const cartContainer = document.querySelector(cartItemsContainer);
  cartContainer.appendChild(createCartItemElement(object, cartContainer));
}

function fetchSelectedItem(param) {
  const cartContainer = document.querySelector(cartItemsContainer);
  return fetch(`https://api.mercadolibre.com/items/${param}`, paramJSON)
    .then((response) => response.json())
    .then(({ id, title, price }) => ({ sku: id, name: title, salePrice: price }))
    .then((object) => insertItemToCart(object))
    .then(() => saveToLocalStorage(`shop-item-${cartContainer.childElementCount}`, param))
    .then(() => sumCart());
}

function getElementsFromLocalStorage() {
  if (localStorage.length > 0) {
    for (let i = 1; i <= localStorage.length; i += 1) {
      fetchSelectedItem(localStorage[`shop-item-${i}`]);
    }
  }
}

function insertElementOnChart() {
  const getItemsBoard = document.querySelectorAll('.item');
  getItemsBoard.forEach((element) => element.lastChild.addEventListener('click', (event) => {
    fetchSelectedItem(event.target.parentNode.firstChild.innerText);
  }));
}

function cleanCart() {
  const cleanButton = document.querySelector('.empty-cart');
  cleanButton.addEventListener('click', () => {
    const cartContainer = document.querySelector(cartItemsContainer);
    cartContainer.innerHTML = '';
    arrayOfShoppedItems.length = 0;
    sumCart();
    window.localStorage.clear();
  });
}

function createLoader() {
  const itemsContainer = document.querySelector('.items');
  const createLoaderDiv = document.createElement('div');
  createLoaderDiv.innerText = 'CARREGANDO';
  createLoaderDiv.className = 'loading';
  itemsContainer.appendChild(createLoaderDiv);
}

function removeLoader() {
  const getLoader = document.querySelector('.loading');
  getLoader.parentNode.removeChild(getLoader);
}

async function execute() {
  createLoader();
  const productList = await getProductList();
  await removeLoader();
  await loopCreateElement(productList);
  await insertElementOnChart();
  getElementsFromLocalStorage();
  await cleanCart();
}

window.onload = function onload() {
  execute();
};
