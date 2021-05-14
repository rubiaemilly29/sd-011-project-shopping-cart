const actualItems = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const container = document.querySelector('.items');

const updateTotalPrice = (price) => {
  totalPrice.innerText = (
    parseFloat(totalPrice.innerText) + parseFloat(price)
  );
};

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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  updateTotalPrice(-event.target.innerText.split('$')[1]);
  event.target.remove();
  localStorage.setItem('actualCart', actualItems.innerHTML);
  localStorage.setItem('actualPrice', totalPrice.innerText);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const showLoading = () => {
  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerText = 'Processando Requisição';
  container.appendChild(loading);
};

const closeLoading = () => {
  const loading = document.querySelector('.loading');
  loading.remove();
};

const createItems = () => {
  showLoading();
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const params = { method: 'GET', headers: { Accept: 'application/json' } };
  const itemsList = document.querySelector('.items');
  return fetch(API_URL, params)
    .then((response) => response.json())
    .then((json) => {
      json.results.forEach((element) =>
        itemsList.appendChild(
          createProductItemElement({
            sku: element.id,
            name: element.title,
            image: element.thumbnail,
          }),
        )); 
})
      .then(closeLoading);
};

const sendItemtoCart = () => {
  const addItemToCart = document.querySelectorAll('.item__add');
  const params = { method: 'GET', headers: { Accept: 'application/json' } };
  const cartItems = document.querySelector('.cart__items');
  addItemToCart.forEach((element) =>
    element.addEventListener('click', () =>
      fetch(
        `https://api.mercadolibre.com/items/${element.parentNode.children[0].innerText}`,
        params,
      )
        .then((response) => response.json())
        .then((json) => {
          cartItems.appendChild(
            createCartItemElement({ sku: json.id, name: json.title, salePrice: json.price }),
          );
          updateTotalPrice(json.price);
        })
        .then(() => localStorage.setItem('actualCart', actualItems.innerHTML))
        .then(() => localStorage.setItem('actualPrice', totalPrice.innerText))));
};

const retrieveCart = async () => {
  if (localStorage.actualCart) {
    actualItems.innerHTML = localStorage.getItem('actualCart');
    actualItems.addEventListener('click', cartItemClickListener);
    totalPrice.innerText = localStorage.getItem('actualPrice');
  }
};

const emptyCart = () => {
  localStorage.clear();
  actualItems.innerHTML = '';
};

document.querySelector('.empty-cart').addEventListener('click', emptyCart);

const createStore = async () => {
  await retrieveCart();
  await createItems();
  await sendItemtoCart();
};

window.onload = function onload() {
  createStore();
};
