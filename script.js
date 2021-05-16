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

const sumProducts = () => {
  const totalPrice = document.querySelector('.total-price');

  const productsLis = [...document.querySelectorAll('.cart__item')];
  
  const pruductsSum = productsLis.reduce((acc, cur) => (
    acc + Number(cur.innerText.split('PRICE: $')[1])), 0);

  totalPrice.innerText = `O valor total da compra é de ${pruductsSum} reais`;

  localStorage.setItem('productsSum', totalPrice.innerHTML);
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

const param = { h: { Accept: 'aplication/json' } };

const fetchCart = async (ItemID) => {
  const apiUrlCart = `https://api.mercadolibre.com/items/${ItemID}`;
      
  fetch(apiUrlCart, param)
  .then((results) => results.json())
  .then((data) => {
  const liProducts = createCartItemElement(data);

  document.querySelector(cartItens).appendChild(liProducts);

  sumProducts();

  localStorage.setItem('productsSave', document.querySelector(cartItens).innerHTML);
  });
};

const loadSaveProducts = () => {
  document.querySelector(cartItens).innerHTML = localStorage.getItem('productsSave');

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

  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', addProduct);
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const sectionItens = document.getElementsByClassName('items')[0];
  sectionItens.appendChild(section);
  section.appendChild(button);  
  return section;
}

const fetchProduct = async (query) => {
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  
  fetch(API_URL, param)
  .then((results) => results.json())
  .then((data) => data.results.forEach((element) => createProductItemElement(element)));
};

const queryProduct = async () => fetchProduct('computador');

const clearCart = () => {
  document.getElementsByTagName('ol')[0].innerHTML = '';
  sumProducts();
};

const clearButton = document.getElementsByClassName('empty-cart')[0];

clearButton.addEventListener('click', clearCart);

window.onload = function onload() {
  queryProduct();
  loadSaveProducts();
};
