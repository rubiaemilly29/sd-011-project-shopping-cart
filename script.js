function getList() {
  const listUpdate = document.querySelector('.cart__items');
  return listUpdate;
}
async function saveLocalStorage() {
  const cartItems = getList();
  const myList = cartItems.innerHTML;
  localStorage.setItem('app', myList);
}

const price = async () => {
  let sum = 0;
  document.querySelectorAll('li').forEach((element) => {
    sum += +(element.innerText.match(/(?<=\$)\d+\.?\d+/));
  });
  document.querySelector('.total-price').innerText = `${sum}`;
};

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

function cartItemClickListener() {
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((item) => item.addEventListener('click', (event) => {
    event.target.remove();
    price();
    saveLocalStorage();
  }));
}

function emptyCart() {
  const emptyButton = document.querySelector('.empty-cart');
  const cartItems = getList();

  emptyButton.addEventListener('click', () => {
    cartItems.innerHTML = '';
    price();
    saveLocalStorage();
  });
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');

  const cartItems = getList();
  cartItems.appendChild(li);
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('mouseover', cartItemClickListener);
  price();
  saveLocalStorage();
  return li;
}

function addCartElement() {
  const itemBtn = document.querySelectorAll('.item__add');
  const itemId = document.querySelectorAll('.item__sku');

  for (let i = 0; i < itemBtn.length; i += 1) {
    itemBtn[i].addEventListener('click', () => {
      const myItem = itemId[i].innerText;
      fetch(`https://api.mercadolibre.com/items/${myItem}`)
        .then((response) => response.json())
        .then((json) => createCartItemElement(json));
    });
  }
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  const items = document.querySelector('.items');
  items.appendChild(section);

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

async function getApiML() {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((json) => json.results.forEach((r) => (createProductItemElement(r))));
  addCartElement();

  document.querySelector('.loading').remove();
}

async function loadLocalStorage() {
  const cartItems = getList();
  const loadedList = localStorage.getItem('app');
  cartItems.innerHTML = loadedList;
}

// Função para chamar funções quando a página carregar
window.onload = function onload() {
  getApiML();
  addCartElement();
  loadLocalStorage();
  cartItemClickListener();
  emptyCart();
  price();
};