const totalPrice = document.querySelector('.total-price');

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

function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const section = document.createElement('section');
  section.className = 'item';
  const selectedItems = document.querySelector('.items');
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => createCartItemElement({ sku, name, price }));
  selectedItems.appendChild((section));
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event, items, count, price) {
  localStorage.removeItem(`items${count}`);

  items.removeChild(event.target);
  
  totalPrice.innerText = parseFloat(Number(totalPrice.innerText) - Number(price));
}

function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  const ol = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  localStorage.setItem(`items${ol.childElementCount}`, `${sku}|${name}|${price}`);
  const count = ol.childElementCount;
  li.addEventListener('click', (event) => cartItemClickListener(event, ol, count, price));
  ol.appendChild(li);
  totalPrice.innerText = parseFloat(Number(totalPrice.innerText) + Number(price));
  return li;
}

const urlFreeMarket = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const param = { method: 'GET', 'Content-Type': 'application/json' };
const loading = document.querySelector('.loading');
const items = document.querySelector('.items');

function itemsForSale() {
  return fetch(urlFreeMarket, param)
  .then((result) => result.json())
  .then((products) =>
  products.results.forEach((selectedProduct) => 
  createProductItemElement(selectedProduct)))
  .then(() => {
    items.removeChild(loading);
    for (let index = 0; index < localStorage.length; index += 1) {
      const [sku, name, price] = (localStorage.getItem(`items${index}`).split('|'));
      const obj = { sku, name, price };
      createCartItemElement(obj);
    }
  });
}

window.onload = function onload() {
  itemsForSale();
};