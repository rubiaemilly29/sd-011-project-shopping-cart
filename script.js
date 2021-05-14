const cartItem = '.cart__items';

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const finalPrice = async () => {
  let sum = 0;
  document.querySelectorAll('li').forEach((element) => {
    sum += +(element.innerText.match(/(?<=\$)\d+\.?\d+/));
  });
  document.querySelector('.total-price').innerText = `${sum}`;
};

const cartItemClickListener = (event) => {
  event.target.parentElement.removeChild(event.target);
  localStorage.setItem('data', document.querySelector(cartItem).innerHTML);
  finalPrice();
};

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = cartItem;
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const onClick = async (id) => {
  const response = await (await fetch(`https://api.mercadolibre.com/items/${id}`)).json();
  const itemToCart = createCartItemElement(response);
  document.querySelector(cartItem).appendChild(itemToCart);
  itemToCart.addEventListener('click', cartItemClickListener);
  finalPrice();
  localStorage.setItem('data', document.querySelector(cartItem).innerHTML);
};

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item'; section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title)); 
  section.appendChild(createProductImageElement(thumbnail));
  const newItem = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(newItem);
  newItem.addEventListener('click', () => onClick(id));
  return section;
}

const loadProducts = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const { results } = await response.json();
  results.forEach((product) => {
    document.querySelector('.items').appendChild(createProductItemElement(product));
  });
  document.querySelector('.loading').remove();
};

const removeCartItems = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector(cartItem).innerHTML = '';
  });
  finalPrice();
  localStorage.removeItem('data');
};

window.onload = function onload() {
  loadProducts();
  document.querySelector(cartItem).innerHTML = localStorage.getItem('data');
  removeCartItems();
  finalPrice();
};
