const cartContainer = document.querySelector('.cart__items');

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

function removeFromLocalStorage(key) {
  localStorage.removeItem(key);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const parentOfItem = (event.target.parentNode);
  parentOfItem.removeChild(event.target);
  removeFromLocalStorage(event.target.id);
}

function addToLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = id;
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCartItemElement = (event) => {
  const itemSKU = getSkuFromProductItem(event.target.parentNode);
  fetch(`https://api.mercadolibre.com/items/${itemSKU}`)
  .then((response) => response.json())
  .then((data) => {
    const cartItemCreated = createCartItemElement(data);
    cartContainer.appendChild(cartItemCreated);
    cartContainer.appendChild(createCustomElement('span', 'item__sku', data.id));
    addToLocalStorage(itemSKU);
  });
};

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  const newButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  newButton.addEventListener('click', addCartItemElement);
  section.appendChild(newButton);

  return section;
}

// Essa função vai servir para fazer a requisição ao endpoint do termo pesquisado e em seguida acessar todos os termos retornados colocando como filhos do container feito para os Itens.

const fetchItems = async (searchTerm) => {
  const itemsContainer = document.querySelector('.items');
  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchTerm}`)
  .then((response) => response.json())
  .then((data) => data.results
  .forEach((product) => itemsContainer.appendChild(createProductItemElement(product))))
  .catch((error) => alert(`Erro na requisição: ${error}`));
};

fetchItems('computador');

const addCartFromLocalStorage = () => {
  const productsInLocalStorage = Object.keys(localStorage);
  productsInLocalStorage.forEach(async (product) => {
    fetch(`https://api.mercadolibre.com/items/${product}`)
    .then((response) => response.json())
    .then((data) => {
      const cartItemCreated = createCartItemElement(data);
      cartContainer.appendChild(cartItemCreated);
    });
  });
};

window.onload = function onload() {
  addCartFromLocalStorage();
};
