const shoppingCart = [];
const fetchApi = (endPoint) => {
  const param = { headers: { Accept: 'application/json' } };
  return fetch(endPoint, param)
  .then((response) => response.json())
  .catch((error) => console.log(error));
};

const formatToBody = (resp) => {
  const values = Object.values(resp);
  const control = values.map((el) => ({
    sku: el.id, 
    name: el.title,
    image: el.thumbnail,
  }));
  return control;
};

const formatToCart = (resp) => {
  const values = [resp];
  const control = values.map((el) => ({
    sku: el.id,
    name: el.title,
    salePrice: el.price,
  }));
  return control;
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
  event.target.parentNode.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const emptyCart = () => { 
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', (event) => {
    const nodes = [...event.target.parentNode.lastElementChild.children];
    nodes.forEach((el) => event.target.parentNode.lastElementChild.removeChild(el));
    localStorage.clear();
  });
};

const pushCartItems = (value) => {
  shoppingCart.push(value);
  return shoppingCart;
};

const retrieveCartItems = () => {
  const cartItems = document.querySelector('.cart__items');
  const items = JSON.parse(localStorage.getItem('myShoppingCart'));
  try {
    items.forEach((ele) => cartItems.appendChild(createCartItemElement(ele[0])));
  } catch (error) {
    console.log('Carrinho vazio');
  }
};

const addItemToCart = async (id) => {
  const cart = document.querySelector('.cart__items');
  await fetchApi(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => formatToCart(response))
  .then((el) => {
    const cartValues = pushCartItems(el);
    localStorage.setItem('myShoppingCart', JSON.stringify(cartValues));
    cart.appendChild(createCartItemElement(el[0]));
  });
};

const getAndCreateElements = async () => {
  const items = document.querySelector('.items');
  await fetchApi('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => formatToBody(response.results))
  .then((formated) => formated.forEach((el) => items.appendChild(createProductItemElement(el))));
};

const exec = async () => {
  await getAndCreateElements();
  const addButton = document.getElementsByClassName('item__add');
  [...addButton].forEach((el) => el.addEventListener('click', (event) => {
    const getId = event.target.parentNode.firstChild.innerText;
    addItemToCart(getId);
  }));
};

window.onload = function onload() {  
  exec();
  retrieveCartItems();
  emptyCart();
};
