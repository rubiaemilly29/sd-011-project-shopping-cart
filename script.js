const apiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const PRODUCT_URL = 'https://api.mercadolibre.com/items/$ItemID';

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// chama a API
async function fetchProducts() {
  return fetch(apiUrl)
    .then((product) => product.json())
    .then((product) => product.results);
}
// cria um section com o retorno da API
async function addProducts() {
  const arrayOfProducts = await fetchProducts();
  arrayOfProducts.forEach((product) => {
    document.querySelector('.items').appendChild(createProductItemElement(product));
  });
}
// A função abaixo solicita da API o item passado como parâmetro
async function fetchAddProduct(itemId) {
  return fetch(PRODUCT_URL.replace('$ItemID', itemId))
    .then((product) => product.json())
    .then((product) => product);
}

async function chooseProductAddToCart() {
  await addProducts();
  const buttonsAdd = document.getElementsByClassName('item__add');
  for (let i = 0; i < buttonsAdd.length; i += 1) {
    const element = buttonsAdd[i];
    element.addEventListener('click', async (e) => {
      const productData = await fetchAddProduct(e.target.parentNode.firstChild.innerText); // busca na API o produto que recebeu o clique
      document.querySelector('.cart__items').appendChild(createCartItemElement(productData)); // adiciona o produto ao carrinho
    });
  }
}

window.onload = function onload() {
  fetchProducts();
  addProducts();
  chooseProductAddToCart();
}; 