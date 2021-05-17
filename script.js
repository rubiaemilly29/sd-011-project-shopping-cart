const cartItemsList = '.cart__items';

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

const createPriceTotal = () => {
  const priceSpecial = document.querySelector('.special-price');
  if (priceSpecial) priceSpecial.remove();
  const cart = document.querySelector('.cart');
  const span = document.createElement('span');
  span.className = 'special-price';
  const storageArray = JSON.parse(localStorage.getItem('item'));
  let totalPrice = 0;
  if (storageArray || storageArray === []) {
    storageArray.forEach((elem) => {
      const spl = elem.split('$');
      totalPrice += parseFloat(spl[1]);
      span.innerText = `${totalPrice}`;
      cart.appendChild(span);
    });
  }
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const listSaved = event.target;
  const txt = listSaved.innerText;
  const price = parseFloat(txt.split('$')[1]);
  const priceSpecial = document.querySelector('.special-price');
  priceSpecial.innerText = parseFloat(priceSpecial.innerText) - price;
  listSaved.remove();
  const storageArray = JSON.parse(localStorage.getItem('item'));
  const storageIndex = storageArray.indexOf(txt);
  storageArray.splice(storageIndex, 1);
  localStorage.setItem('item', JSON.stringify(storageArray));
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const apiCarItem = (id) => {
  const API = `https://api.mercadolibre.com/items/${id}`;
  const headers = { headers: { Accept: 'application/json' } };

  fetch(API, headers)
    .then((response) => response.json())
    .then((json) => {
      const cartList = document.querySelector(cartItemsList);
      cartList.appendChild(createCartItemElement(json));
      createPriceTotal();
  });
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const btn = createCustomElement('btn', 'item_add', 'Adicionar ao carrinho!');
  btn.addEventListener('click', ({ target }) => {
    apiCarItem(getSkuFromProductItem(target.parentElement));
  });

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(btn);

  return section;
}

function displayLoading() {
  const load = document.querySelector('#loader');
  load.classList.add('display');
  setTimeout(() => {
      load.classList.remove('display');
  }, 5000);
}

function hideLoading() {
  const loader = document.querySelector('#loader');
  const loaderClass = document.querySelector('.loading');
  loader.classList.remove('display');
  loaderClass.remove();
}

const apiFetch = () => {
  const apiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const apiHeader = { apiHeader: { Accept: 'application/json' } };

  fetch(apiUrl, apiHeader).then((response) => response.json).then((json) => {
    console.log(json.results);
    const jsonResults = json.results;
    const mainSection = document.querySelector('.items');
    jsonResults.forEach((cpu) => {
     mainSection.appendChild(createProductItemElement(cpu));
    });
  });
};

const getItemFunction = () => {
  const cartShopping = document.querySelector(cartItemsList);
  const storageArray = JSON.parse(localStorage.getItem('item'));
  if (storageArray) {
    storageArray.forEach((computer) => {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = computer;
      cartShopping.appendChild(li);
    });
  }
};

const removeOnClick = () => {
  const emptyBttn = document.querySelector('.empty-cart');
  emptyBttn.addEventListener('click', () => {
    const cartShopping = document.querySelector(cartItemsList);
    cartShopping.innerHTML = '';
  });
};

window.onload = function onload() {
  apiFetch();
  getItemFunction();
  removeOnClick();
};
