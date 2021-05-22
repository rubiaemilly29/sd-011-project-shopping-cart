// 1 - Crie uma listagem de produtos.
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
function cartItemClickListener(event) {
  // coloque seu código aqui.
  const cartItens = document.querySelector('.cart__items');
  cartItens.removeChild(event.target);
}
async function findProducts(key = 'computador') {
  try {
    const queryCompute = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${key}`);
    const json = await queryCompute.json();
    return json.results;
  } catch (error) {
    alert(error);
  }
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function addToCar(event) {
  const idItem = getSkuFromProductItem(event.path[1]);
  const products = await findProducts();
  const container = products.find((product) => product.id === idItem);
  const cartItens = document.querySelector('.cart__items');
  const itemElement = createCartItemElement(container);
  cartItens.appendChild(itemElement);
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.addEventListener('click', addToCar);

  return section;
}

function createsProductContainers() {
  // coloque seu código aqui.
  findProducts().then((products) => {
    products.forEach((product) => {
      const itemsSection = document.querySelector('.items');
      itemsSection.appendChild(createProductItemElement(product));
    });
  }).catch((element) => alert(element));
}

window.onload = function onload() { 
  createsProductContainers();
};