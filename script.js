const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

async function apiRequest() {
  return fetch(api)
  .then((data) => data.json())
  .then((data) => data.results);
}

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

async function displayProducts() {
  const apiData = await apiRequest();
  const productsSection = document.querySelector('.items');
  apiData.forEach((product) => {
    const { id: sku, title: name, thumbnail_id: imagem } = product;
    const image = `http://http2.mlstatic.com/D_${imagem}-I.jpg`;

    productsSection.appendChild(createProductItemElement({ sku, name, image }));
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {

}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() { 
  displayProducts();
};