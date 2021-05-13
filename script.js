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

// function createCartItemElement({ id, title, price }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

const testFunction = (event) => console.log(event.target.parentNode.firstChild.innerText);

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

// Essa função vai servir para fazer a requisição ao endpoint do termo pesquisado e em seguida acessar todos os termos retornados colocando como filhos do container para os Itens.

const fetchItem = async (searchTerm) => {
  const itemsContainer = document.querySelector('.items');
  const searchResult = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchTerm}`)
  .then((response) => response.json())
  .then((data) => data.results)
  .catch((error) => alert(`Erro na requisição: ${error}`));

  searchResult.forEach((product) => itemsContainer.appendChild(createProductItemElement(product)));
};

fetchItem('computador');

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }
