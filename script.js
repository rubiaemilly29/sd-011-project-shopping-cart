const itemOnCart = document.querySelector('.cart__items');
const container = document.querySelector('.container');
const allPrice = document.querySelector('.total-price');

function startLoading() {
  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerHTML = 'loading...';
  container.appendChild(loading);
}

function endLoading() {
  container.removeChild(container.lastChild);
}

const emptyCart = document.querySelector('.empty-cart');
emptyCart.addEventListener('click', () => {
  const ShoppingCart = document.querySelector('.cart__items');
  ShoppingCart.querySelectorAll('*').forEach((node) => node.remove());
  allPrice.innerHTML = '';
  return localStorage.clear();
});

async function sumCart() {
  const cartItems = itemOnCart.childNodes;
  const price = [];
  cartItems.forEach((item) => price.push(Number(item.innerText.split('$')[1])));
  const totalSum = price.reduce((acc, cur) => acc + cur, 0);
  allPrice.innerHTML = Math.round(totalSum * 100) / 100;
  allPrice.innerText = `Total: ${allPrice.innerHTML}`;
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
function cartItemClickListener(event) {
  const elements = event.target;
  elements.parentNode.removeChild(elements);
  localStorage.setItem('Element', itemOnCart.innerHTML);
  localStorage.setItem('TotalPrice', allPrice.innerHTML);
  sumCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getItemFromML(event) {
  const id = event.target.parentElement.querySelector('.item__sku').innerText;
  const url = `https://api.mercadolibre.com/items/${id}`;
  const param = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  await fetch(url, param)
  .then((response) => response.json())
  .then((json) => {
    const newElement = createCartItemElement({ sku: json.id, 
      name: json.title,
      salePrice: json.price });
      itemOnCart.appendChild(newElement);
      localStorage.setItem('Element', itemOnCart.innerHTML);
      sumCart();
      localStorage.setItem('TotalPrice', allPrice.innerHTML);
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.lastChild.addEventListener('click', getItemFromML);
  return section;
}

async function retrieveQuerryFromML(querry) {
  startLoading();
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${querry}`;
  const param = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  await fetch(url, param)
  .then((response) => response.json())
  .then((json) => json.results)
  .then((json) => { 
    json.forEach(({ id, title, thumbnail }) => {
      const itemsSection = document.querySelector('.items');
      const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
      itemsSection.appendChild(item);
  });
})
.then((() => endLoading()));
}

function loadLocalStorage() {
  itemOnCart.innerHTML = localStorage.getItem('Element');
  const itemsSelection = document.querySelectorAll('li');
  itemsSelection.forEach((li) => li.addEventListener('click', cartItemClickListener));
  allPrice.innerHTML = localStorage.getItem('TotalPrice');
}
window.onload = function onload() {
  retrieveQuerryFromML('computador');
  loadLocalStorage();
};
