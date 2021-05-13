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

function createCartItemElement({ sku, name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(li)
  .addEventListener('click', (event) => cartItems.removeChild(event.target));
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add',
   'Adicionar ao carrinho!')).addEventListener('click', 
   () => createCartItemElement({ sku, name, price }));
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
  return section;
}

const getProduct = (term) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`)
    .then((response) => response.json())
    .then((response) => response.results.forEach((computer) => createProductItemElement(computer)));
};

const fetchProduct = () => {
  getProduct('computador');
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

window.onload = function onload() { 
  fetchProduct();
};
