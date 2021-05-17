const totalPrice = () => document.querySelector('.total-price');
const itemsSection = () => document.querySelector('.items');
const fetchParameter = () => ({
    method: 'GET',
    'Content-Type': 'application/json',
});

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

function search(query) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`, fetchParameter())
    .then((result) => result.json())
    .then((data) => data.results.forEach((result) => {
      const itemAtributtes = {
        sku: result.id,
        name: result.title,
        image: result.thumbnail,
      };
      const newItem = createProductItemElement(itemAtributtes);
      itemsSection().appendChild(newItem);
      }));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

function sumOfPrices(price) {
  const currentSum = Math.round((parseFloat(totalPrice().innerText) + price) * 100) / 100;
  totalPrice().innerText = currentSum;
}

function newCartItem(sku, cartItemsList, savedCartItems) {
  fetch(`https://api.mercadolibre.com/items/${sku}`, fetchParameter())
    .then((result) => result.json())
    .then((data) => {
      const itemAtributtes = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      const cartItem = createCartItemElement(itemAtributtes);
      cartItemsList.appendChild(cartItem);
      savedCartItems.push(itemAtributtes.sku);
      localStorage.cartItems = JSON.stringify(savedCartItems);
      sumOfPrices(itemAtributtes.salePrice);
    });
}

function subtractionOfPrices(price) {
  const currentSub = Math.round((parseFloat(totalPrice().innerText) - price) * 100) / 100;
  totalPrice().innerText = currentSub;
}

function removeCartItem(sku, savedCartItems) {
  fetch(`https://api.mercadolibre.com/items/${sku}`, fetchParameter())
    .then((result) => result.json())
    .then((data) => {
      const { price } = data;
      subtractionOfPrices(price);
      savedCartItems.forEach((item, index) => {
        let deletedItems = 0;
        if (item === sku && deletedItems === 0) {
          savedCartItems.splice(index, 1);
          deletedItems += 1;
        }
      });
      localStorage.cartItems = JSON.stringify(savedCartItems);
    });
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
    const sku = event.target.innerText.split(' ')[1];
    removeCartItem(sku, savedCartItems);
    cartItemsList.removeChild(event.target);
  }
  if (event.target.className === 'empty-cart') {
    removeAllCartItems(cartItemsList);
  }
}

function addRecoveredCartItems(sku, cartItemsList) {
  fetch(`https://api.mercadolibre.com/items/${sku}`, fetchParameter())
    .then((result) => result.json())
    .then((data) => {
      const itemAtributtes = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      sumOfPrices(itemAtributtes.salePrice);
      const cartItem = createCartItemElement(itemAtributtes);
      cartItemsList.appendChild(cartItem);
    });
}

function recoverCart(cartItemsList) {
  if (localStorage.getItem('cartItems') !== null) {
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    savedCartItems.forEach((cartItem) => {
      addRecoveredCartItems(cartItem, cartItemsList);
    });
  } else {
    localStorage.setItem('cartItems', JSON.stringify([]));
  }
}

window.onload = function onload() {
  search('computador').then(() => {
    itemsSection().removeChild(itemsSection().firstElementChild);
  });
  const cart = document.querySelector('.cart');
  const cartItemsList = document.querySelector('.cart__items');
  const items = [itemsSection(), cart];
  recoverCart(cartItemsList);
  items.forEach((item) => {
    item.addEventListener('click', (event) => {
      cartItemClickListener(event, cartItemsList);
    });
  });
};
