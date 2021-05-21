const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const totalPrice = () => {
  const list = document.querySelectorAll('.cart__item');
  let sum = 0;
   for (let i = 0; i < list.length; i += 1) {
    const valor = list[i].innerHTML.split('$')[1];
    sum += Number(valor);
  }
  const total = document.querySelector('.total-price');
  total.innerHTML = sum;
};

const ShoppingCart = () => {
  const cartItem = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('ShoppingCart', cartItem);
};

const cartItemClickListener = ({ target }) => {
  if (target !== null && target.parentNode !== null) {
    target.parentNode.removeChild(target);
    ShoppingCart();
    totalPrice();
  }
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const createCartItemElement = ({ sku, name, price }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const addProduct = ({ target }) => {
  const itemID = getSkuFromProductItem(target.parentNode);
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((resolve) => resolve.json())
    .then((json) => {
      const item = {
        sku: json.id,
        name: json.title,
        price: json.price,
      };
      document.querySelector('ol.cart__items').appendChild(createCartItemElement(item));
      ShoppingCart();
      totalPrice();
    });
};

const createProductItemElement = ({ id: sku, title: name, thumbnail: image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addProduct);

  return section;
};

const getProducts = () => {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const headers = { headers: { Accept: 'application/json' } };
  const loading = document.querySelector('.loading');
  fetch(API_URL, headers)
    .then((response) => response.json())
    .then((json) => {
      loading.parentNode.removeChild(loading);
      const result = json.results;
      const section = document.querySelector('.items');
      result.forEach((computer) => {
        section.appendChild(createProductItemElement(computer));
      });
    });
};

const returnList = () => {
  const storageList = window.localStorage.getItem('ShoppingCart');
  document.querySelector('.cart__items').innerHTML = storageList;
  let list = document.getElementsByClassName('cart__items');
  list = Array.from(list);
  list.forEach((element) => {
  element.addEventListener('click', cartItemClickListener);
  });
};

window.onload = function onload() {
  getProducts();
  returnList();
  document.querySelector('.empty-cart')
  .addEventListener('click', () => {
    const cartItems = document.querySelector('ol.cart__items');
    cartItems.innerHTML = '';
    localStorage.clear();
    totalPrice();
  });
};