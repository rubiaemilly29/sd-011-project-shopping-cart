const search = 'computador';
let returnAPI = [];
let cart;
let listCart;

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

const sumCart = () => {
  const total = document.querySelector('.total-price');
  let result;
  let sum = 0;
  if (cart.childNodes.length >= 1) {
    for (let index = 0; index < returnAPI.length; index += 1) {
      sum += returnAPI[index].salePrice;
    }
    result = Math.round(sum * 100) / 100;
    total.innerText = result;
  } else {
    total.innerText = 0.00;
  }
};

const removeCart = (itemRemove) => {
  const excluir = returnAPI.find((value) => value.sku === itemRemove);
  returnAPI.forEach((value, index) => {
    if (value === excluir) {
      returnAPI.splice(index, 1);
      localStorage.removeItem(itemRemove);
    }
  });
  return sumCart();
};

function cartItemClickListener(event) {
  const itemRemove = event.target.innerText.substring(5, 18);
  removeCart(itemRemove);
  cart.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function searchItems() {
  return new Promise((resolve, reject) => {
    if (search === undefined) return reject();
    const api = fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`);
    resolve(api);
  })
  .then((response) => response.json())
  .then((object) => { 
    if (object.error) {
      throw new Error(object.error);
    }
    object.results.forEach((value) => {
      const item = { sku: value.id, name: value.title, image: value.thumbnail };
      document.querySelector('.items').appendChild(createProductItemElement(item));
    });
  })
  .catch((error) => {
      window.alert(error);
  });
}

const requisitionAddCart = (event) => {
  const id = getSkuFromProductItem(event.target.parentElement);
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((object) => { 
  const item = { sku: object.id, name: object.title, salePrice: object.price };
  localStorage.setItem(object.id, JSON.stringify(item));
  listCart.appendChild(createCartItemElement(item));
  returnAPI.push({ sku: object.id, salePrice: object.price });
  sumCart();
  })
  .catch((error) => {
    window.alert(error);
  });
};

const addItemCart = () => {
  const buttom = document.querySelector('.items');
  buttom.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      requisitionAddCart(event);
    }
  });
};

function clearCart() {
  const buttomClear = document.querySelector('.empty-cart');
  buttomClear.addEventListener('click', () => {
    localStorage.clear();
    const itemCart = document.querySelectorAll('.cart__item');
    for (let index = itemCart.length; index > 0; index -= 1) {
      cart.removeChild(itemCart[index - 1]);
    }
    returnAPI = [];
    sumCart();
  });
}

const getValues = () => {
  const keys = Object.values(localStorage);
  if (keys.length > 0) {
    keys.forEach((value) => {
      const obj = JSON.parse(value);
      listCart.appendChild(createCartItemElement(obj));
      returnAPI.push({ sku: obj.sku, salePrice: obj.salePrice });
      sumCart();
    });
  }
};

const loading = async () => {
  await searchItems();
  document.querySelector('.loading').remove();
};

window.onload = function onload() {
  loading();
  addItemCart();
  cart = document.querySelector('.cart__items');
  listCart = document.querySelector('.cart__items');
  sumCart();
  getValues();
  clearCart();
};
