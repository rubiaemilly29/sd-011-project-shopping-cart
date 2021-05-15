function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener() {
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

function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addProduct({ target }) {
  const itemID = getSkuFromProductItem(target.parentNode);
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((resolve) => resolve.json())
    .then((data) => {
      const item = {
        sku: data.id,
        name: data.title,
        price: data.price,
      };
      const itemSelect = document.querySelector('.cart__items');
      itemSelect.appendChild(createCartItemElement(item));
    });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addProduct);

  return section;
}

const getProducts = () => {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const headers = { headers: { Accept: 'application/json' } };

  fetch(API_URL, headers)
    .then((response) => response.json())
    .then((json) => {
      const result = json.results;
      const section = document.querySelector('.items');
      result.forEach((computer) => {
        section.appendChild(createProductItemElement(computer));
      });
    });
};

function deleteAllCart() {
  const li = document.querySelectorAll('.cart__item');
  const ol = document.querySelector('ol');
  li.forEach((list) => ol.removeChild(list));
}

window.onload = async function onload() {
  await getProducts();
  document.querySelector('.empty-cart')
  .addEventListener('click', deleteAllCart);
};