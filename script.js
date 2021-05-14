let returnAPI = [];
let cart;

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

function searchItems(search) {
  const section = document.querySelector('.items');
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`)
  .then((response) => response.json())
  .then((object) => { 
    if (object.error) {
      throw new Error(object.error);
    }
    object.results.forEach((value) => {
      const item = { sku: value.id, name: value.title, image: value.thumbnail };
      section.appendChild(createProductItemElement(item));
    });
  })
  .catch((error) => {
    window.alert(error);
  });
}

const addItemCart = () => {
  const buttom = document.querySelector('.items');
  buttom.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const id = event.target.parentElement.firstElementChild.innerText;
      const listCart = document.querySelector('.cart__items');
      fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json())
      .then((object) => { 
        const item = { sku: object.id, name: object.title, salePrice: object.price };
        listCart.appendChild(createCartItemElement(item));
        returnAPI.push({ sku: object.id, salePrice: object.price });
        sumCart();
      })
      .catch((error) => {
        window.alert(error);
      });
    }
  });
};

function clearCart() {
  const buttomClear = document.querySelector('.empty-cart');
  buttomClear.addEventListener('click', () => {
    const itemCart = document.querySelectorAll('.cart__item');
    for (let index = itemCart.length; index > 0; index -= 1) {
      cart.removeChild(itemCart[index - 1]);
    }
    returnAPI = [];
    sumCart();
  });
}

window.onload = function onload() {
  const search = 'computador';
  searchItems(search);
  addItemCart();
  cart = document.querySelector('.cart__items');
  sumCart();
  clearCart();
};
