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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) { 
  const getCart = document.querySelector('ol.cart__items');
  event.target.remove(getCart);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addProductsToCart = () => {
  const getButtom = document.querySelectorAll('.item__add');
  const getCart = document.querySelector('ol.cart__items');
  
  getButtom.forEach((item) => {
    item.addEventListener('click', () => {
      const id = item.parentElement.firstChild.innerText;
      fetch(`https://api.mercadolibre.com/items/${id}`)
         .then((response) => response.json())
         .then((elements) => getCart.appendChild(createCartItemElement(elements)));
    });
  });
};
const myPromise = () => new Promise(() => {
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  const getItems = document.querySelector('.items');

  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', myObject)
    .then((response) => response.json())
    .then((elements) => {
      elements.results
    .forEach((item) => getItems.appendChild(createProductItemElement(item)));
    })
    .then(() => addProductsToCart());
});
myPromise();

/* const getButtom = document.querySelectorAll('.item__add');
const getCart = document.querySelector('ol.cart__items');
    getButtom.addEventListener('click', addProductsToCart());

    getCart.forEach((item) => getCart.appendChild(createCartItemElement(item)));
    return getCart; */

window.onload = function onload() { };