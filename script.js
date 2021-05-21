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

const carrinhoItem = '.cart__items';

function sumPrices() {
  let sum = 0;
  const getPrice = document.querySelectorAll('.cart__item');
  getPrice.forEach((item) => {
    sum += Number(item.innerText.split('PRICE: $')[1]);
  });
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = sum;
  }

function saveLocal() {
  const cartItems = document.querySelector(carrinhoItem).innerHTML;
  localStorage.setItem('items', cartItems);
  sumPrices();
}

function cartItemClickListener(event, count) {
  event.target.remove();
  sumPrices();
  saveLocal();
}

function getLocal() {
  const cartItems = document.querySelector(carrinhoItem);
  cartItems.innerHTML = localStorage.getItem('items');
  cartItems.addEventListener('click', (event) => { 
    if (event.target.classList.contains('cart__item')) { cartItemClickListener(event); }
  });
}

function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  const items = document.querySelector('.cart__items');
  items.appendChild(li);
  sumPrices();
  saveLocal();
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const section = document.createElement('section');
  section.className = 'item';
  const items = document.querySelector('.items');
  items.appendChild(section);
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => createCartItemElement({ sku, name, price }));
  sumPrices();

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function emptyCart() {
  const clearBtn = document.querySelector('.empty-cart');
  clearBtn.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    sumPrices();
    saveLocal();
  });
}

const fetchAPI = (product = 'computador') => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
  .then((response) => response.json())
    .then((data) => data.results.forEach((item) => createProductItemElement(item)));
    sumPrices();
    saveLocal();
    };

window.onload = function onload() { 
  fetchAPI();
  emptyCart();
  getLocal();
};
