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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event, id) {
  const cart = document.querySelector('.cart__items');
  cart.removeChild(event.target);
  localStorage.setItem('cart', cart.innerHTML);
}

function createCartItemElement(computer) {
  const li = document.createElement('li');
  const { id, title, price } = computer;
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', (event) =>
    cartItemClickListener(event, `${id}`));
  return li;
}

function addToCart(computer) {
   const li = createCartItemElement(computer);
   const cart = document.querySelector('.cart__items');
   cart.appendChild(li);
   localStorage.setItem('cart', cart.innerHTML);
}

function createProductItemElement(computer) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', computer.id));
  section.appendChild(createCustomElement('span', 'item__title', computer.title));
  section.appendChild(createProductImageElement(computer.thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => addToCart(computer));
  return section;
}

const fetchComputer = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const computers = await response.json();
  computers.results.forEach((computer) => {
    document.querySelector('.items').appendChild(createProductItemElement(computer));
  });
};

const loadCartItems = async () => {
  const cart = document.querySelector('.cart__items');
  const items = localStorage.getItem('cart');
  if (items) cart.innerHTML = items;
}

window.onload = () => {
  fetchComputer();
  loadCartItems();
};
