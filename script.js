window.onload = function onload() { };
const cartItens = document.querySelector('.cart__items');

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
if (localStorage.list !== undefined) {
  const oldList = window.localStorage.getItem('list').split('§');
  console.log(oldList);
  oldList.forEach((value) => {
    const newCartItem = document.createElement('li');
    if (value !== '') {
      newCartItem.className = 'onCart__item';
      newCartItem.innerText = `${value}`;
      cartItens.appendChild(newCartItem);
    }
  });
}
let newArrayCartItem = '';

function cartItemClickListener(event) {
  const toRemove = event.target;
  event.target.parentElement.removeChild(toRemove);
  newArrayCartItem = '';
  for (let index = 0; index < cartItens.children.length; index += 1) {
    newArrayCartItem += `${cartItens.children[index].innerText}§`;
    localStorage.setItem('list', newArrayCartItem);
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const listOfItems = document.querySelector('.items');
function fetchMercadoLivre() {
  return new Promise((resolve, reject) => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((body) => {
        body.results.forEach((element) => {
          const newItem = {
            sku: element.id,
            name: element.title,
            image: element.thumbnail,
          };
          listOfItems.appendChild(createProductItemElement(newItem));
        });
      });
  });
}
fetchMercadoLivre();

function addItemToList() {
  listOfItems.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const sku = event.target.parentElement.firstChild.innerText;
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then((response) => response.json())
        .then((body) => {
          const newCartItem = document.createElement('li');
          newCartItem.className = 'onCart__item';
          newCartItem.innerText = `SKU: ${body.id} | NAME: ${body.title} | PRICE: $${body.price}`;
          cartItens.appendChild(newCartItem);
          newArrayCartItem += `${newCartItem.innerText}§`;
          localStorage.setItem('list', newArrayCartItem);
        });
    }
  });
}
addItemToList();
cartItens.addEventListener(('click'), cartItemClickListener);
