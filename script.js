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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(li);
}

function createProductItemElement({ id: sku, title: name, thumbnail: image, price: salePrice }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => createCartItemElement({ sku, name, salePrice }));

  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const createSpanLoading = () => {
  const span = document.createElement('span');
  span.classList.add('loading');
  span.innerText = 'loading...';
  const container = document.querySelector('.container');
  container.appendChild(span);
};

const removeSpanLoading = () => {
  const container = document.querySelector('.container');
  container.lastChild.remove();
};

const createProductList = () => {
  createSpanLoading();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((json) => json.results)
    .then((results) => results.forEach((value) => createProductItemElement(value)))
    .then((__) => removeSpanLoading())
    .catch((error) => error);
};

const buttonCartListener = () => {
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => {
    const liCartItems = document.querySelectorAll('.cart__item');
    liCartItems.forEach((value) => value.remove());
  });
};

window.onload = function onload() {
  createProductList();
  buttonCartListener();
};