const olclass = 'ol.cart__items';

const prodSum = () => {
  const items = [...document.querySelectorAll('li.cart__item')];
  const price = items.reduce((acc, li) => Number(li.innerText.split('$')[1]) + acc, 0);
  const totalPrice = document.querySelector('span.total-price');
  totalPrice.innerText = price;
};

function cartItemClickListener() {
  this.remove();
  const cartList = document.querySelector(olclass);
  localStorage.setItem('olCart', cartList.innerHTML);
  prodSum();
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const Card = async (event) => {
  const itemID = getSkuFromProductItem(event.target.parentElement);
  const addItem = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const itemJson = await addItem.json();
  createCartItemElement(itemJson);
  prodSum();
};

const emptyCartButton = document.querySelector('.empty-cart');
emptyCartButton.addEventListener('click', () => {
  const olCart = document.querySelector(olclass);
  olCart.innerText = '';
  prodSum();
  localStorage.clear();
});

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', Card);
  
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
}

const felement = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador') 
    .then((response) => response.json())
    .then((json) => {
      document.querySelector('.loading').remove();
      json.results.forEach((element) => createProductItemElement(element));
    })
    .catch((err) => window.alert(err));
};
 
const loandE = () => {
  const storage = localStorage.getItem('olCart');
  const olList = document.querySelector(olclass);
  olList.innerHTML = storage;
  const liItem = document.querySelectorAll('li.cart__item');
  liItem.forEach((li) => li.addEventListener('click', cartItemClickListener));
};

window.onload = function onload() { 
  prodSum();
  felement();
  loandE();
};
