const myObject = {
  method: 'GET',
  headers: { Accept: 'application/json' },
};

let sectionItems;
let addItemButtons;
let cartItemsList;
let sectionPrice;
let buttonEmptyCart;
let storageList = [];
const skuItems = [];

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

const addToStorage = async () => {
  storageList = [];
  if (cartItemsList.childNodes.length > 0) {
    cartItemsList.childNodes.forEach((cartItem) => {
      const content = cartItem.textContent;
      storageList.push(content);
      localStorage.setItem('cart', JSON.stringify(storageList));
    });
  } else {
    localStorage.clear();
  }
};

async function updatePrice(cartList) {
  const itemsPrice = [];

  cartList.childNodes.forEach((cartItem) => {
    itemsPrice.push(parseFloat(cartItem.textContent.split('$')[1]));
  });
  
  const priceSum = itemsPrice.reduce((acc, curr) => acc + curr, 0);

  return priceSum;
}

async function showTotalPrice(cartList) {
  const totalPrice = document.createElement('span');

  if (!sectionPrice.hasChildNodes()) {
    totalPrice.className = 'total-price';
    totalPrice.innerText = await updatePrice(cartList);
    sectionPrice.appendChild(totalPrice);
  } else {
    sectionPrice.innerText = '';
    totalPrice.className = 'total-price';
    totalPrice.innerText = await updatePrice(cartList);
    sectionPrice.appendChild(totalPrice);
  }

  if (!cartList.hasChildNodes()) {
    sectionPrice.innerText = '';
  }
}

function cartItemClickListener(event) {
  event.target.remove();
  addToStorage();
  updatePrice(cartItemsList);
  showTotalPrice(cartItemsList);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchDetails(sku) {
  const API_URL = `https://api.mercadolibre.com/items/${sku}`;

  return new Promise((resolve, reject) => {
    fetch(API_URL, myObject)
    .then((response) => {
      response.json()
        .then(({ id, title, price }) => {
          cartItemsList
          .appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
          resolve({ id, title, price });
        }).catch((error) => reject(error));
    }).catch((error) => reject(error));
  });
}

const getStorage = () => {
  let storage = localStorage.getItem('cart');
  storage = JSON.parse(storage);
  
  if (storage) {
    storage.forEach((storageItem) => {
      const li = document.createElement('li');
      li.innerText = storageItem;
      li.addEventListener('click', cartItemClickListener);
      cartItemsList.appendChild(li);
    });
  }
};

async function addToCart(sku) {
  await fetchDetails(sku);
  addToStorage();
  updatePrice(cartItemsList);
  showTotalPrice(cartItemsList);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', () => addToCart(sku));
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);

  return section;
}

function fetchSearch(keyword) {
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${keyword}`;

  return new Promise((resolve, reject) => {
    fetch(API_URL, myObject)
      .then((response) => {
        response.json()
          .then(({ results }) => {
            results.forEach(({ id, title, thumbnail }) => {
              sectionItems
                .appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
            });
          }).then(() => {
              addItemButtons = document.querySelectorAll('.item__sku');
              addItemButtons.forEach((item) => skuItems.push(item.textContent));
              resolve();
            }).catch((error) => reject(error));
      }).catch((error) => reject(error));
  });
}

function clearCart() {
  showTotalPrice(cartItemsList);
  cartItemsList.innerText = '';
}

window.onload = async function onload() {
  sectionItems = document.querySelector('.items');
  cartItemsList = document.querySelector('.cart__items');
  sectionPrice = document.querySelector('.price');
  buttonEmptyCart = document.querySelector('.empty-cart');
  buttonEmptyCart.addEventListener('click', clearCart);
  getStorage();
  showTotalPrice(cartItemsList);
  await fetchSearch('computador');
};