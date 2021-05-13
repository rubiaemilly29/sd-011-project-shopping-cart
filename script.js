window.onload = function onload() {
  queryProduct();
};

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
  const sectionItens = document.getElementsByClassName('items')[0];
  sectionItens.appendChild(section);
  return section;
}

//function getSkuFromProductItem(item) {
  //return item.querySelector('span.item__sku').innerText;
//}

//function cartItemClickListener(event) {
  // coloque seu código aqui
//}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchProduct = (query) => {
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  
  fetch(API_URL)
  .then((results) => results.json())
  .then((data) => data.results.forEach((element) => createProductItemElement(element)));
};

const queryProduct = () => fetchProduct('computador');
