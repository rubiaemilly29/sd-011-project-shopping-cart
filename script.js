function totalPrice() {
  const list = document.querySelectorAll('.cart__item');
  const spanElement = document.querySelector('.total-price');
  let total = 0;
  list.forEach((value) => {
    total += parseFloat(value.innerText.split('$')[1]);
  });
  spanElement.innerText = total;
}

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

const cartItemsClass = '.cart__items';

function saveLocal() {
  const cartItems = document.querySelector(cartItemsClass).innerHTML;
  localStorage.setItem('items', cartItems);
}

function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);
  saveLocal();
  totalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  saveLocal();
  return li;
}

function itemsObj(data) {
  return {
    sku: data.id,
    name: data.title,
    image: data.thumbnail,
  };
}

function addItemToList(item) {
  document.querySelector('.items').appendChild(item);
}

function renderItemsHTML(items) {
  items.forEach((item) => {
    addItemToList(item);
  });
}

function getItems(nameItem) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${nameItem}`)
    .then((response) => response.json())
    .then((json) => json.results.map((data) => itemsObj(data)))
    .then((reusltData) => reusltData.map((item) => createProductItemElement(item)))
    .then((itemsHTML) => renderItemsHTML(itemsHTML));
}

function itemsCartObj(data) {
  return {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };
}

function addToCartList(item) {
  document.querySelector(cartItemsClass).appendChild(item);
  saveLocal();
  totalPrice();
}

function addCartItem() {
  document.querySelector('.items').addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const sibling = event.target.parentElement;
      const query = getSkuFromProductItem(sibling);
      const link = `https://api.mercadolibre.com/items/${query}`;
      fetch(link)
      .then((reponse) => reponse.json())
      .then((data) => itemsCartObj(data))
      .then((item) => addToCartList(createCartItemElement(item)));
    }
  });
}

function renderLocalStorage() {
  const cartItems = document.querySelector(cartItemsClass);
  cartItems.innerHTML = localStorage.getItem('items');
  cartItems.addEventListener('click', (event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItemClickListener(event);
    }
  });
}

function removeAll() {
  const ol = document.querySelector(cartItemsClass);
  while (ol.firstChild) {
    ol.removeChild(document.querySelector('li'));
    totalPrice();
    saveLocal();
  }
}

function emptyCart() {
  const emptyBtn = document.querySelector('.empty-cart');
  emptyBtn.addEventListener('click', removeAll);
}

window.onload = function onload() { 
  getItems('computer');
  addCartItem();
  renderLocalStorage();
  totalPrice();
  emptyCart();
};
