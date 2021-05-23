const cartContainer = document.querySelector('.cart');
const fetchCartFromStorage = () => {
  const dataInStorage = localStorage.getItem('shopping-cart') || ''; 
  console.log('got ', dataInStorage, ' from storage');
  return dataInStorage.length ? JSON.parse(dataInStorage) : [];
};

const saveCart = (newCart) => {
  localStorage.setItem('shopping-cart', JSON.stringify(newCart));
};

const appendItemToCart = (item) => {
  const lastSave = fetchCartFromStorage() || [];
  saveCart([...lastSave, item]);
};

const removeItemFromCart = (itemID) => {
  const lastSave = fetchCartFromStorage();
  const newCart = lastSave.filter((item) => item.id === itemID);
  saveCart(newCart);
};

function createJason(element) {
  const newElement = element.json();
  return newElement;
}

const getResults = (response) => response.results;

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} 

function createItemLink(id) {
  const link = fetch(`https://api.mercadolibre.com/items/${id}`);
  return link.json();
}

function cartItemClickListener(event) {
  removeItemFromCart(event.target.id);
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getProductDetails(productId) {
  const url = `https://api.mercadolibre.com/items/${productId}`;
  const response = await fetch(url);
  return response.json();
}

function addItemToCart(cartElement) {
  document.querySelector('.cart__items').appendChild(cartElement);
}

async function handleAdd(e) {
  const productId = getSkuFromProductItem(e.target.parentElement);
  const { id, title, price } = await getProductDetails(productId);
  const prodDetails = { sku: id, name: title, salePrice: price };
  appendItemToCart(prodDetails);
  const cartItemElement = createCartItemElement(prodDetails);
  addItemToCart(cartItemElement);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', handleAdd);
  section.appendChild(button);

  return section;
}

function addResultToPage(result) {
  const itemsSection = document.querySelector('.items');
  const productData = { sku: result.id, name: result.title, image: result.thumbnail };
  const resultElement = createProductItemElement(productData);
  itemsSection.appendChild(resultElement);
}

window.onload = async function onload() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await createJason(response);
  const results = getResults(data);
  results.map(addResultToPage);
  const lastSave = fetchCartFromStorage();
  lastSave.map((i) => addItemToCart(createCartItemElement(i)));
};
