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

async function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToLocalStorage = (cartItems) => {
  const lista = cartItems.innerHTML;
  localStorage.setItem('lista', lista);
};

const addItemToCart = (sku) => {
  const cartItems = document.querySelector('.cart__items');
  const url = `https://api.mercadolibre.com/items/${sku}`;
  const format = { headers: { Accept: 'application/json' } };
  fetch(url, format)
    .then((response) => {
      response.json()
        .then((json) => {
          const { title: name, price: salePrice } = json;
          const item = createCartItemElement({ sku, name, salePrice });
          cartItems.appendChild(item);
          addToLocalStorage(cartItems);
        });
    });
};

function addButtonEvent(item) {
  const button = item.querySelector('.item__add');
  button.addEventListener('click', (event) => {
    const itemId = getSkuFromProductItem(event.target.parentNode);
    addItemToCart(itemId);
  });
}

const showProducts = async () => {
  const parent = document.querySelector('.items');

  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const format = { headers: { Accept: 'application/json' } };

  await fetch(url, format)
    .then((response) => {
      response.json()
      .then((json) => {
        json.results.forEach((item) => {
          const { id: sku, title: name, thumbnail: image } = item;
          const product = createProductItemElement({ sku, name, image });
          parent.appendChild(product);
          addButtonEvent(product);
        });
      });
    });
};

function loadCart() {
  const cartItems = document.querySelector('.cart__items');
  if (localStorage.length > 0) cartItems.innerHTML = localStorage.getItem('lista');
}

window.onload = function onload() {
  showProducts();
  loadCart();
 };
