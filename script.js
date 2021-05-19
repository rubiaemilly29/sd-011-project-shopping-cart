const myObject = {
  method: 'GET',
  headers: { Accept: 'application/json' },
};

let sectionItems;
let addItemButtons;
let cartItemsList;
const skuItems = [];

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
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', getItemId);
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener() {
  return alert('testes');
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getItemId(event) {
  const itemId = event.target.parentNode.firstChild.textContent;
  fetchDetails(itemId);
}

function fetchSearch(keyword) {
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${keyword}`;

  return new Promise((resolve, reject) => {
    fetch(API_URL, myObject)
      .then((response) => {
        response.json()
          .then(({ results }) => {
            results.forEach(({ id, title, thumbnail }) => {
              sectionItems
                .append(createProductItemElement({ sku: id, name: title, image: thumbnail }));
            });
          }).then(() => {
              addItemButtons = document.querySelectorAll('.item__sku');
              addItemButtons.forEach((item) => skuItems.push(item.textContent));
              resolve();
            }).catch((error) => reject(error));
      }).catch((error) => reject(error));
  });
}

function fetchDetails(itemId) {
  const API_URL = `https://api.mercadolibre.com/items/${itemId}`;

  fetch(API_URL, myObject)
    .then((response) => response.json())
    .then(({ id, title, price }) => {
      cartItemsList.append(createCartItemElement({ sku: id, name: title, salePrice: price }));
    });
}

window.onload = async function onload() {
  sectionItems = document.querySelector('.items');
  cartItemsList = document.querySelector('.cart__items');
  await fetchSearch('computador');
};