async function fetchComputer() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const jsonResponse = await response.json();
  const result = await jsonResponse.results;
  return result;
}

function getLocalStorage() {
  const item = localStorage.getItem('shopping-cart');
  const cartItem = item ? JSON.parse(item) : [];
  return cartItem;
}

function setLocalStorage(cartItem) {
  localStorage.setItem('shopping-cart', JSON.stringify(cartItem));
}

function removeItemStorage(id) {
  const cart = getLocalStorage();
  const newCart = cart.filter((e) => e.sku !== id);
  setLocalStorage(newCart);
}

function addItem(item) {
  const cart = getLocalStorage();
  cart.push(item);
  setLocalStorage(cart);
}

async function fetchID(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const jsonResponse = await response.json();
  const result = await jsonResponse;
  return result;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getPriceFromProductItem(item) {
  return item.querySelector('span.item__price').innerText;
}

function createCustomElement(element, className, innerText, event) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (event) {
    e.addEventListener('click', event);
  }
  return e;
}

function cartItemClickListener(event) {
  removeItemStorage(event.target.id);
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(list, price) {
  const cartList = document.querySelector('.cart__items');
  const recipiente = document.querySelector('span.total-price');
  const atual = document.querySelector('span.total-price').innerText;

  cartList.appendChild(list);
  const priceUpdate = parseFloat(getPriceFromProductItem(price));
  const sum = priceUpdate + parseFloat(atual);
  recipiente.innerText = Math.round(sum * 100) / 100;
}

function adItem(event) {
  const ev = getSkuFromProductItem(event.target.parentElement);
  const value = event.target.parentElement;
  fetchID(ev)
    .then(({ id, title, price }) => {
      addItem({ sku: id, name: title, salePrice: price });
      return createCartItemElement({ sku: id, name: title, salePrice: price });
    })
    .then((list) => addToCart(list, value))
    .catch((e) => console.error(e));
}
  
function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('span', 'item__price', price));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', adItem));
  return section;
}

function loadStorage() {
  const cartArray = getLocalStorage();
  const cartList = document.querySelector('.cart__items');

  cartArray.forEach(({ sku, name, salePrice }) => { 
  cartList.appendChild(createCartItemElement({ sku, name, salePrice })); 
});
}

window.onload = async () => {
  const items = document.querySelector('.items');
  const list = await fetchComputer();
  list.forEach(({ id, title, thumbnail, price }) => { 
    const listedItens = createProductItemElement({ sku: id, name: title, image: thumbnail, price });
    items.appendChild(listedItens);
  });
  this.cartList = document.querySelector('.cart_items');
  loadStorage();
};