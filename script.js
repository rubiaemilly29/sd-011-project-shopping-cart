const cartItemsOl = '.cart__items';

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

const countCart = () => {
  const totalPrice = document.querySelector('.total-price');
  let sumPrices = 0;
  const li = document.querySelectorAll('li');
  li.forEach((e) => {
    const splitted = e.innerText.split('$');
    sumPrices += Number(splitted[1]);
  });
  totalPrice.innerHTML = `${sumPrices}`;
};

function cartItemClickListener(event) {
  event.target.remove();
  countCart();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const saveCartStorage = () => {
  const cartItems = document.querySelector(cartItemsOl).innerHTML;
  localStorage.setItem('savedCart', cartItems);
};

const addItemCart = async (event) => {
  const cartItems = document.querySelector(cartItemsOl);
  const id = await getSkuFromProductItem(event.target.parentElement);
  const item = await getItemByID(id);
  cartItems.appendChild(createCartItemElement(item));
  saveCartStorage();
  countCart();
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

// adicionar cada produto da API em cada section item, filha da section items e remove o loading depois de carregar a API.
const searchQuery = async (query) => {
  const fetchApi = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const data = await fetchApi.json();
  document.querySelector('.loading').remove();
  data.results.forEach((d) => createProductItemElement(d));
};

// pega os itens do localStorage setado como savedCart e coloca no innerHTML da ol cart__items
const getItemsFromLocalStorage = () => {
  const ol = document.querySelector(cartItemsOl);
  const savedCart = localStorage.getItem('savedCart');
  ol.innerHTML = savedCart;
};

const emptyButton = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    document.querySelector(cartItemsOl).innerHTML = '';
    localStorage.clear();
    countCart();
  });
};

window.onload = function onload() { 
  searchQuery('computador');
  getItemsFromLocalStorage();
  emptyButton();
  countCart();
};