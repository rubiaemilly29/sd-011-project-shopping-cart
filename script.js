const cartList = (document.querySelector('.cart__items'));
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

const cartItens = '.cart__items';

const sumProducts = async () => {
  const totalPrice = document.querySelector('.total-price');
  const productsLis = [...document.querySelectorAll('.cart__item')];
  const pruductsSum = productsLis.reduce((acc, cur) => (
    acc + Number(cur.innerText.split('PRICE: $')[1])), 0);
  totalPrice.innerText = pruductsSum;
  localStorage.setItem('totalSum', totalPrice.innerHTML);
};

function cartItemClickListener(event) {
  event.target.remove();
  return sumProducts();
}

function createCartItemElement({ id: ItemID, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${ItemID} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
 }

const param = { Headers: { Accept: 'aplication/json' } };

const fetchCart = async (sku) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`, param)
  .then((results) => results.json())
  .then((json) => {
  const liProducts = createCartItemElement(json);
  document.querySelector(cartItens).appendChild(liProducts);
  sumProducts();
  localStorage.setItem('shoppingCart', document.querySelector(cartItens).innerHTML);
  });
};

const savedProducts = () => {
  document.querySelector(cartItens).innerHTML = localStorage.getItem('shoppingCart');
  document.querySelector('.total-price').innerHTML = localStorage.getItem('productsSum');
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const addProduct = async (event) => {
  fetchCart(getSkuFromProductItem(event.target.parentElement));
  return sumProducts();
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const sectionItens = document.querySelector('.items');
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  sectionItens.appendChild(section);
  button.addEventListener('click', addProduct);
  section.appendChild(button);  
  return section;
}

const fetchProduct = async (query) => {
  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`, param)
  .then((results) => results.json())
  .then((json) => json.results.forEach((element) => createProductItemElement(element)));
};

const queryProduct = async () => fetchProduct('computador');

const cleanCart = () => {
  cartList.innerHTML = '';
  localStorage.setItem('shoppingCart', '');
  localStorage.setItem('productsSum', '');
  sumProducts();
};

const clearButton = document.querySelector('.empty-cart');
clearButton.addEventListener('click', cleanCart);

window.onload = function onload() {
  queryProduct();
  savedProducts();
};