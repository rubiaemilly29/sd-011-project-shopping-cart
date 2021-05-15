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

const fetchProducts = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const json = await response.json();
  const products = await json.results;
  return products;
};

const fetchItem = async (id) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const product = await response.json();
  return product;
};

const createProductList = async () => {
  const prods = await fetchProducts();
  const items = document.querySelector('.items');
  prods.forEach(({ id, title, thumbnail }) => {
    const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
    items.appendChild(item);
  });
};

const catchItem = async event => {
  const itemID = getSkuFromProductItem(event.target.parentElement); //catch product id
  const prodList = document.querySelector('ol.cart__items');
  const prod = await fetchItem(itemID);
  const item = createCartItemElement({ sku: prod.id, name: prod.title, salePrice: prod.price });
  prodList.appendChild(item);
};

const addCartItem = async () => {
  await createProductList();
  const buttons = document.querySelectorAll('button.item__add');
  buttons.forEach(button =>  button.addEventListener('click', catchItem));
}; 

window.onload = function onload() { 
  // createProductList();
  addCartItem();
};