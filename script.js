const classOl = '.cart__items';
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

const sumPrices = () => {
  const price = document.querySelector('.total-price');
  console.log(price);
  const getLi = [...document.querySelectorAll('.cart__item')];
  const sumLi = getLi.reduce((acc, curr) => acc + Number(curr.innerText.split('PRICE: $')[1]), 0);
  price.innerText = sumLi;
  };

function cartItemClickListener(event, contador) { 
  localStorage.removeItem(`item ${contador}`);
  event.target.remove();
  return sumPrices();
}

function removeFinalizados() {
  const getButtom = document.querySelector('.empty-cart');
  getButtom.addEventListener('click', () => {
    const getCart = document.querySelector(classOl);
    getCart.innerHTML = '';
    localStorage.clear();
  });
}

function createCartItemElement({ id: sku, title: name, price: salePrice }, contador) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, contador));
  return li;
}

const setLocalStorage = () => {
  const getCart = document.querySelector(classOl);
  for (let index = 0; index < localStorage.length; index += 1) {
    const storage = localStorage.getItem(`item ${index}`);
      fetch(`https://api.mercadolibre.com/items/${storage}`)
        .then((response) => response.json())
        .then((elements) => getCart.appendChild(createCartItemElement(elements, index)))
        .then(() => sumPrices());
  }
};

const addProductsToCart = () => {
  const getButtom = document.querySelectorAll('.item__add');
  const getCart = document.querySelector('.cart__items');
  
  getButtom.forEach((item) => {
    item.addEventListener('click', () => {
      const id = item.parentElement.firstChild.innerText;
      const contador = getCart.childElementCount;
      fetch(`https://api.mercadolibre.com/items/${id}`)
        .then((response) => response.json())
        .then((elements) => getCart.appendChild(createCartItemElement(elements, contador)))
        .then(() => sumPrices());
        localStorage.setItem(`item ${contador}`, id);
    });
  });
};
const load = async () => {
  const getItems = document.querySelector('.cart');
  const createNewSpan = document.createElement('span');
  getItems.appendChild(createNewSpan);
  createNewSpan.classList = 'loading';
  createNewSpan.innerHTML = 'loading...';
  
  await (await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')).json();
  document.querySelector('.loading').remove();
};

const myPromise = () => new Promise(() => {
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  const getItems = document.querySelector('.items');

  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', myObject)
    .then((response) => response.json())
    .then((elements) => elements.results
    .forEach((item) => getItems.appendChild(createProductItemElement(item))))
    .then(() => addProductsToCart())
    .then(() => setLocalStorage())
    .then(() => load());
  });

window.onload = () => { 
  myPromise();
  removeFinalizados();
  load();
};
