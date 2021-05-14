const urlcomp = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
const param = { method: 'GET', headers: { Accept: 'application/json' } }; 
const cartList = document.querySelector('.cart__items');

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

function cartItemClickListener(event) {
  cartList.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function creatItem(item) {
  const itemSection = document.querySelector('.items');
  const result = createProductItemElement({ 
    sku: item.id, 
    name: item.title, 
    image: item.thumbnail,
  });
  itemSection.appendChild(result);
}

async function fetchItemId(idItem) {
  return fetch(`https://api.mercadolibre.com/items/${idItem}`, param)
    .then((response) => response.json());
}

async function addElementToCart(event) {
  const buttonTarget = event.target;
  const id = buttonTarget.parentNode.firstChild.innerText;
  const fetchResult = await fetchItemId(id);
  const { title: name, price: salePrice } = fetchResult;
  cartList.appendChild(createCartItemElement({ sku: id, name, salePrice }));
}

function clickButtonAddCart() {
  const sectionButton = document.querySelectorAll('.item__add');
  sectionButton.forEach((item) => item.addEventListener('click', addElementToCart));
}

// Apesar de NodeList não ser um Array, é possível ser iterada usando o método forEach(). Muitos navegadores antigos ainda não implementaram este método.

function getProductList() {
  fetch(urlcomp, param)
    .then((response) => response.json())
    .then((data) => data.results.forEach((item) => { 
      creatItem(item);
    }))
    .then(() => clickButtonAddCart());
}

window.onload = function onload() { 
  getProductList();
};
