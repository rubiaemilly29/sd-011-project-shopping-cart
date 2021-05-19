const ol = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event, price) {
  event.target.remove();
  totalPrice.innerText = Number(Number(totalPrice.innerText) - Number(price));
}

function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, price));
  localStorage.setItem(`item${ol.childElementCount}`, `${sku}|${name}|${price}`);
  const count = ol.childElementCount;
  totalPrice.innerText = Number(Number(totalPrice.innerText) + Number(price));
  return li;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
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
    .then((r) => r.forEach((computer) => getItemsSection
      .appendChild(createProductItemElement(computer))))
    .then(() => {
      for (let index = 0; index < localStorage.length; index += 1) {
        const [sku, name, price] = (localStorage.getItem(`item${index}`).split('|'));
        const objItems = { sku, name, price };
        ol.appendChild(createCartItemElement(objItems));
      }
});
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  createContainer();
};
