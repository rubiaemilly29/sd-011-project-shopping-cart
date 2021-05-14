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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const removeItem = event.target;
  localStorage.removeItem(removeItem.innerText);
  removeItem.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getItemForCart = (itemID) => {
  const myObjects = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };

  fetch(`https://api.mercadolibre.com/items/${itemID}`)
  .then((response) => response.json())
  .then((json) => {
    const item = createCartItemElement({ sku: json.id, name: json.title, salePrice: json.price });
    document.querySelector('.cart__items').appendChild(item);
    localStorage.setItem(item.innerText, item.innerText);
  });
};

const addButtonItem = () => {
  const buttonItem = document.querySelector('.items');
  buttonItem.addEventListener('click', (event) => {
    const idItem = event.path[1].children[0].innerText;
    getItemForCart(idItem);
  });
};

const getItens = () => {
  const myObjects = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };

  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', myObjects)
  .then((response) => response.json())
  .then((json) => json.results.forEach((item) => {
    const i = createProductItemElement({ sku: item.id, name: item.title, image: item.thumbnail });
    document.querySelector('.items').appendChild(i);
  }));
};

const recoveryCartLocalStorage = () => {
  const local = Object.entries(localStorage);
  local.forEach((itemCart) => {
    const li = document.createElement('li');
    const litext = itemCart[1];
    li.className = 'cart__item';
    li.innerText = litext;
    li.addEventListener('click', cartItemClickListener);
    document.querySelector('.cart__items').appendChild(li);
  });
};

window.onload = function onload() { 
  getItens();
  addButtonItem();
  recoveryCartLocalStorage();
};
