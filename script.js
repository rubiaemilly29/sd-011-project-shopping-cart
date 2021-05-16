const URL_API = 'https://api.mercadolibre.com/sites/MLB/search';
const URL_API_ITEM = 'https://api.mercadolibre.com/items/';
const classParentOl = '#main__cart__items';

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
  const parent = document.querySelector(classParentOl);
  return parent.removeChild(event.target);
}

function createItemLocalStorage(sku, name, salePrice) {
  const item = { id: sku, title: name, price: salePrice };
  localStorage.setItem(sku, JSON.stringify(item));
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  createItemLocalStorage(sku, name, salePrice);
  const ol = document.querySelector(classParentOl);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  ol.appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function reloadCartFromLocalStorage() {
  if (localStorage.length === 0) {
    return;
  }
  for (let index = 0; index < localStorage.length; index += 1) {
    const itemJson = localStorage.getItem(localStorage.key(index));
    const item = JSON.parse(itemJson);
    createCartItemElement(item);
  }
}

function createButton(itemSku) {
  const button = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );

  button.addEventListener('click', () => {
    fetch(`${URL_API_ITEM}${itemSku.innerText}`)
      .then((response) => response.json())
      .then((responseJson) => {
        createCartItemElement(responseJson);
      });
  });

  return button;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const mainItems = document.querySelector('#main__items');
  const section = document.createElement('section');
  const itemSku = createCustomElement('span', 'item__sku', sku);

  mainItems.appendChild(section);

  section.className = 'item';
  section.appendChild(itemSku);
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createButton(itemSku));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function emptyCart() {
  const children = document.querySelectorAll('.cart__item');
  const parentOl = document.querySelector(classParentOl);
  children.forEach((child) => parentOl.removeChild(child));
  localStorage.clear();
}

window.onload = function onload() {
  const emptyCartButton = document.querySelector('#empty-cart');
  emptyCartButton.addEventListener('click', emptyCart);
  fetch(`${URL_API}?q=computador`)
    .then((response) => response.json())
    .then((responseJson) => responseJson.results)
    .then((results) => results.forEach((result) => createProductItemElement(result)));
  reloadCartFromLocalStorage();
};
