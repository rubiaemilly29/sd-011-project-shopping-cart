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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const item = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  item.appendChild((section));
  return section;
}

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

const addButtonsListener = () => {
  const elementoPai = document.querySelector('.cart__items');
  const buttonsList = document.querySelectorAll('.item__add');
  buttonsList.forEach((button) => {
    button.addEventListener('click', (event) => {
      const id = event.target.parentElement.firstChild.innerText;
      fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json())
      .then((data) => elementoPai.appendChild(createCartItemElement(data)));
    });  
  });
};

const itensList = () => {
  const apiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const myObject = { method: 'GET', headers: { Accept: 'application/json' } };
  fetch(apiUrl, myObject)
  .then((response) => response.json())
  .then((data) => data.results.forEach((value) => createProductItemElement(value)))
  .then(() => addButtonsListener());
};

window.onload = function onload() {
  itensList();  
};
