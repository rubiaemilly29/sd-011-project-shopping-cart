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
  const cartOl = document.getElementsByClassName('cart__items')[0];
  cartOl.removeChild(event.target);
}

function createCartItemElement({ id: ItemID, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${ItemID} | Nome: ${name} | Preço: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
 }

const param = { h: { Accept: 'aplication/json' } };

const fetchCart = (ItemID) => {
  const apiUrlCart = `https://api.mercadolibre.com/items/${ItemID}`;
  const cartOl = document.getElementsByClassName('cart__items')[0];
    
  fetch(apiUrlCart, param)
  .then((results) => results.json())
  .then((data) => (
    cartOl.appendChild(createCartItemElement(data))
  ));
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const addProduct = (event) => {
  fetchCart(getSkuFromProductItem(event.target.parentElement));
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', addProduct);
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const sectionItens = document.getElementsByClassName('items')[0];
  sectionItens.appendChild(section);
  section.appendChild(button);  
  return section;
}

const fetchProduct = (query) => {
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  
  fetch(API_URL, param)
  .then((results) => results.json())
  .then((data) => data.results.forEach((element) => createProductItemElement(element)));
};

const queryProduct = () => fetchProduct('computador');

window.onload = function onload() {
  queryProduct();
};
