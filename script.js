window.onload = function onload() {};

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
  // coloque seu código aqui
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const testFunction = (event) => {
  const cartContainer = document.querySelector('.cart__items');
  const itemSKU = (event.target.parentNode.firstChild.innerText);
  fetch(`https://api.mercadolibre.com/items/${itemSKU}`)
  .then((response) => response.json())
  .then((data) => cartContainer.appendChild(createCartItemElement(data)));
};

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  const newButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  newButton.addEventListener('click', testFunction);
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
