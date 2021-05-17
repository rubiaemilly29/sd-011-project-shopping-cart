const getListClass = document.querySelector('.cart__items');
const container = document.querySelector('.container');
function startLoading() {
  const loading = document.createElement('h3');
  loading.className = 'loading';
  loading.innerHTML = 'loading...';
  container.appendChild(loading);
}

function endLoading() {
  container.removeChild(container.lastChild);
}

const emptyButton = document.querySelector('.empty-cart');
emptyButton.addEventListener('click', () => {
  const ShoppingCart = document.querySelector('.cart__items');
  ShoppingCart.querySelectorAll('*').forEach((n) => n.remove());
  return localStorage.clear();
});

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
  const element = event.target;
  element.parentNode.removeChild(element);
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
      getListClass.appendChild(newElement);
      localStorage.setItem('Element', getListClass.innerHTML);
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

async function getObjects() {
  startLoading();
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
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
  getListClass.innerHTML = localStorage.getItem('Element');
  const itemsSelection = document.querySelectorAll('li');
  itemsSelection.forEach((li) => li.addEventListener('click', cartItemClickListener));
}
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
window.onload = function onload() {
  getObjects();
  loadLocalStorage();
};