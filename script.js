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

// realizar a requisição para o endpoint:
const getItemByID = async (id) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const data = await response.json();
  return data;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemCart = async (event) => {
  const cartItems = document.querySelector('.cart__items');
  const id = await getSkuFromProductItem(event.target.parentElement);
  const item = await getItemByID(id);
  cartItems.appendChild(createCartItemElement(item));
};

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addItemCart);

  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);

  return section;
}

// adicionar cada produto da API em cada section item, filha da section items
const searchQuery = async (query) => {
  const fetchApi = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const data = await fetchApi.json();
  data.results.forEach((d) => createProductItemElement(d));
};

window.onload = function onload() { 
  searchQuery('computador');
};