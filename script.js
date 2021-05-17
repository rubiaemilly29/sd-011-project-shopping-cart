function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

function verifiedFetch(url) {
  return new Promise((resolve, reject) => {
    if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
      return fetch(url)
        .then((result) => result.json())
        .then((json) => resolve(json.results.forEach((result) => {
          const itemAtributtes = {
            sku: result.id,
            name: result.title,
            image: result.thumbnail,
          };
          const newItem = createProductItemElement(itemAtributtes);
          const itemsSection = document.querySelector('.items');
          itemsSection.appendChild(newItem);
        })));
    }
    reject(new Error('endpoint não existe'));
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

const totalPrice = () => document.querySelector('.total-price');

async function sumOfPrices(price) {
  const currentSum = Math.round((parseFloat(totalPrice().innerText) + price) * 100) / 100;
  totalPrice().innerText = currentSum;
}

async function newCartItem(sku, cartItemsList, savedCartItems, save = true) {
  const fetchParameter = {
    method: 'GET',
    'Content-Type': 'application/json',
  };
  return fetch(`https://api.mercadolibre.com/items/${sku}`, fetchParameter)
    .then((result) => result.json())
    .then((json) => {
      const itemAtributtes = {
        sku: json.id,
        name: json.title,
        salePrice: json.price,
      };
      sumOfPrices(itemAtributtes.salePrice);
      if (save !== false) savedCartItems.push(itemAtributtes.sku);
      localStorage.cartItems = JSON.stringify(savedCartItems);
      const cartItem = createCartItemElement(itemAtributtes);
      cartItemsList.appendChild(cartItem);
    });
}

async function subtractionOfPrices(cartItem) {
  let price = cartItem.innerText.split(' ');
  price = parseFloat(price[price.length - 1].slice(1));
  const currentSub = Math.round((parseFloat(totalPrice().innerText) - price) * 100) / 100;
  totalPrice().innerText = currentSub;
}

function removeCartItem(cartItem, cartItemsList, savedCartItems) {
  cartItemsList.removeChild(cartItem);
  const sku = cartItem.innerText.split(' ')[1];
  savedCartItems.forEach((item, index) => {
  let deletedItems = 0;
    if (item === sku && deletedItems === 0) {
      subtractionOfPrices(cartItem);
      savedCartItems.splice(index, 1);
      deletedItems += 1;
    }
  });
  localStorage.cartItems = JSON.stringify(savedCartItems);
}

function removeAllCartItems(cartItemsList) {
  totalPrice().innerText = 0;
  localStorage.cartItems = JSON.stringify([]);
  while (cartItemsList.firstChild) cartItemsList.removeChild(cartItemsList.lastChild);
}

function cartItemClickListener(event, cartItemsList) {
  const savedCartItems = JSON.parse(localStorage.getItem('cartItems'));
  if (event.target.className === 'item__add') {
    const sku = event.target.parentNode.firstChild.innerText;
    newCartItem(sku, cartItemsList, savedCartItems);
  }
  if (event.target.className === 'cart__item') {
    removeCartItem(event.target, cartItemsList, savedCartItems);
  }
  if (event.target.className === 'empty-cart') {
    removeAllCartItems(cartItemsList);
  }
}

function recoverCart(cartItemsList) {
  if (localStorage.getItem('cartItems') !== null) {
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    savedCartItems.forEach((cartItem) => {
      newCartItem(cartItem, cartItemsList, savedCartItems, false);
    });
  } else {
    localStorage.setItem('cartItems', JSON.stringify([]));
  }
}

window.onload = function onload() {
  verifiedFetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const itemsSection = document.querySelector('.items');
  const cart = document.querySelector('.cart');
  const cartItemsList = document.querySelector('.cart__items');
  const items = [itemsSection, cart];
  recoverCart(cartItemsList);
  items.forEach((item) => {
    item.addEventListener('click', (event) => {
      cartItemClickListener(event, cartItemsList);
    });
  });
};
