const olclass = 'ol.cart__items';

const somaProd = () => {
  const liItems = [...document.querySelectorAll('li.cart__item')];
  const price = liItems.reduce((acc, li) => Number(li.innerText.split('$')[1]) + acc, 0);
  const totalPrice = Document.querySelector('span.total-price');
  totalPrice.innerText = price;
};

function cartItemClickListener() {
  this.remove();
  const cartList = document.querySelector(olclass);
  localStorage.setItem('olCart', cartList.innetHTML);
  somaProd();
}

function createCartItemElement({ id: sku, title: name, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  const cartListt = document.querySelector(olclass);
  cartListt.appendChild(li);
  localStorage.setItem('olCart', cartListt.innerHTML);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const newTag = document.createElement(element);
  newTag.className = className;
  newTag.innerText = innerText;
  return newTag;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const addToCart = async (event) => {
  const itemID = getSkuFromProductItem(event.target.parentElement);
  const itemToAdd = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const itemJson = await itemToAdd.json();
  createCartItemElement(itemJson);
  somaProd();
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addToCart);
  
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
}

const dataApi = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((json) => {
    document.querySelector('.loading').remove();
    json.results.forEach((element) => createProductItemElement(element));
  })
  .catch((err) => window.alert(err));
};

const loadLocalStorage = () => {
  const storage = localStorage.getIrem('olCart');
  const olList = document.querySelector(olclass);
  olList.innerHTML = storage;
  const liItem = document.querySelectorAll('li.cart__item');
  liItem.forEach((li) => li.addEventListener('click', cartItemClickListener));
};

window.onload = function onload() { 
  dataApi();
  somaProd();
  loadLocalStorage();
};
