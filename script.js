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

function cartItemClickListener(event) {
  event.target.remove();
}

const arr = [];
function createCartItemElement(props) {
  const { sku, name, price } = props;
  const li = document.createElement('li');
  arr.push(props);
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  localStorage.setItem('item', JSON.stringify(arr));
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const section = document.createElement('section');
  const cartItems = document.querySelector('.cart__items');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => cartItems
      .appendChild(createCartItemElement({ sku, name, price })));

  return section;
}

function createContainer() {
  const getItemsSection = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((r) => r.json())
    .then((r) => (r.results))
    .then((r) => r.forEach((computer) => {
      getItemsSection.appendChild(createProductItemElement(computer));
    }));
}

async function getCartLocal() {
  const ol = document.querySelector('.cart__items');
  const cartItems = JSON.parse(localStorage.getItem('item'));
  await cartItems.forEach((computer) => {
    ol.appendChild(createCartItemElement(computer));
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  createContainer();
  getCartLocal();
};
