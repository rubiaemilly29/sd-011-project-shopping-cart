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

function saveLocalStorage() {
  const cart02 = document.getElementsByClassName('cart__items')[0].innerHTML;
  localStorage.setItem('myListIems', cart02);
}

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  saveLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function handleButtonAdd(event) {
  const sku = event.target.parentElement.querySelector('.item__sku').innerText;
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then((response) => response.json())
    .then((response) => {
      const li = createCartItemElement({ sku: response.id,
        name: response.title,
        salePrice: response.price });
      const cart = document.querySelector('.cart__items');
      cart.appendChild(li);
      saveLocalStorage();
    });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonElement = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonElement.addEventListener('click', handleButtonAdd);
  section.appendChild(buttonElement);

  return section;
}

const fetchItems = () => {
  const options = {};
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  return fetch(url, options)
    .then((response) => response.json())
    .then(({ results }) => results)
    .catch((error) => console.error(error));
};

const addItems = async () => {
  const items = await fetchItems();

  const containerItem = document.querySelector('section.items');

  items.forEach((item) => {
    containerItem.appendChild(createProductItemElement(item));
  });
};

window.onload = function onload() {
  addItems();
};

const saveItems = window.localStorage.getItem('myListItems');
document.querySelector('.cart__items').innerHTML = saveItems;
  const itemsSaved = document.getElementsByClassName('cart__items');
  for (let i = 0; i < itemsSaved.length; i += 1) {
    itemsSaved[i].addEventListener('click', cartItemClickListener);
  }