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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getProductsFetch = (url) => new Promise((resolve, reject) => {
  const itemSection = document.querySelector('.items');
  if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
  fetch(url)
  .then((data) => data.json())
  .then((data) => data.results.map((result) => {
    const elementItem = createProductItemElement(result);
    return itemSection.appendChild(elementItem);
  }));
  resolve();
}
  reject();
});

const clickFetch = (url) => {
  if (url === 'https://api.mercadolibre.com/items/$ItemID') {
    fetch(url)
    .then((data) => data.json())
    .then((data) => console.log(data));
  }
}

window.onload = function onload() {
  getProductsFetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  clickFetch('https://api.mercadolibre.com/items/$ItemID');
};
