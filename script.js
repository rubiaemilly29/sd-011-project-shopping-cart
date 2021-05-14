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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createTotal() {
  const list = document.querySelectorAll('.cart__item');
  let sum = 0;
    for (let index = 0; index < list.length; index += 1) {
      const valor = list[index].innerHTML.split('$')[1];
      sum += Number(valor);
    }
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = sum;
}

function clearCart() {
  const li = document.querySelectorAll('.cart__item');
  const ol = document.querySelector('ol');
  console.log(li);
  for (let index = 0; index < li.length; index += 1) {
    ol.removeChild(li[index]);
  }
  createTotal();
}

function cartItemClickListener(event, counter) {
  const local = event.target;
  document.querySelector('.cart__items').removeChild(local);
  localStorage.removeItem(`item${counter}`);
  createTotal();
}

function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  const cartList = document.querySelector('.cart__items');
  const counter = cartList.childElementCount;
  localStorage.setItem(`item${counter}`, `${sku}|${name}|${price}`);
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, counter));
  cartList.appendChild(li);
  createTotal();
  return li;
}

function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => createCartItemElement({ sku, name, price }));

  return section;
}

const fetchProducts = (product) => {
  const loading = document.querySelector('.loading');
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=$${product}`;
  fetch(API_URL)
    .then((response) => response.json())
      .then((products) => {
        loading.parentNode.removeChild(loading);
        products.results.forEach(({ id, title, thumbnail, price }) => {
          document.querySelector('.items')
          .appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail, price }));
        });
      })
      .then(() => {
        for (let index = 0; index < localStorage.length; index += 1) {
          const [sku, name, price] = localStorage.getItem(`item${index}`).split('|');
          createCartItemElement({ sku, name, price });
        }
      });
};

window.onload = function onload() {
  fetchProducts('computador');
  const cart = document.querySelector('.empty-cart');
  cart.addEventListener('click', clearCart);
};
