const ol = '.cart__items';
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
// getSkuFromProductItem();

const sumPrices = () => {
const totalPrice = document.querySelector('.total-price');
const lis = [...document.querySelectorAll('.cart__item')];
totalPrice.innerText = 0;
const somaLis = lis.reduce((acc, curr) => acc + Number(curr.innerText.split('PRICE: $')[1]), 0);
totalPrice.innerText = somaLis;
};

function cartItemClickListener(event, contador) {
  localStorage.removeItem(`items ${contador}`);
  event.target.remove();
  sumPrices();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }, contador) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, contador));
  return li;
}

const getItens = () => {
const buttonCart = document.querySelectorAll('.item__add');
const itensCart = document.querySelector(ol);
buttonCart.forEach((elemento) => elemento.addEventListener('click', () => {
const id = elemento.parentElement.firstChild.innerText;
const contador = itensCart.childElementCount;
 fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((data) => itensCart.appendChild(createCartItemElement(data, contador)))
  .then(() => sumPrices());
  localStorage.setItem(`items ${contador}`, id);
  }));
};

const recuperaLocalStorage = () => {
const itensCart = document.querySelector(ol);
for (let index = 0; index < localStorage.length; index += 1) {
    const local = localStorage.getItem(`items ${index}`);
  fetch(`https://api.mercadolibre.com/items/${local}`)
    .then((response) => response.json())
    .then((data) => itensCart.appendChild(createCartItemElement(data, index)))
    .then(() => sumPrices());
      }
};

const listOfProducts = () => {
const api = `https://api.mercadolibre.com/sites/MLB/search?q=${'computador'}`;
const myObject = {
  method: 'GET',
  headers: { Accept: 'application/json' },
};
  fetch(api, myObject)
  .then((response) => {
    response.json().then((data) => data.results
    .forEach(({ id, title, thumbnail }) => {
      const sectionItem = document.querySelector('.items');
      const objList = createProductItemElement({ sku: id, name: title, image: thumbnail });
      sectionItem.appendChild(objList);
    })).then(() => getItens()).then(() => recuperaLocalStorage());
  });
};

const esvaziar = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    localStorage.clear();
  });
};

window.onload = () => {
listOfProducts();
esvaziar();
};