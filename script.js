const cartItems = '.cart__items';

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

function fetchProducts() {
  return new Promise((resolve) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((json) => resolve(json.results));
  });
}

async function showTheProducts() {
  await fetchProducts()
  .then((products) => {
    products.forEach((item) => {
      const itemFinded = { sku: item.id, name: item.title, image: item.thumbnail };
      document.getElementsByClassName('items')[0]
      .appendChild(createProductItemElement(itemFinded));
    });
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(value) {
  const getItem = document.querySelector('ol.cart__items');
  value.target.remove(getItem);
  const saveCart = document.querySelectorAll(cartItems);
  localStorage.cartStatus = saveCart;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getIdItems(item) {
  return new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/items/${item}`)
    .then((toJson) => toJson.json())
    .then((result) => resolve(result));
  });
}

async function addToShoppingCart(id) {
  await getIdItems(id)
  .then((item) => {
    const data = { sku: item.id, name: item.title, salePrice: item.price };
    const createAnElement = createCartItemElement(data);
    document.querySelectorAll(cartItems)[0].appendChild(createAnElement);
  });
}

function buttonToAdd() {
  const buttons = document.querySelectorAll('.item');
  buttons.forEach((values) => {
    values.addEventListener('click', async () => {
      await addToShoppingCart(values.firstChild.innerText);
      const saveCart = document.querySelectorAll(cartItems)[0].innerHTML;
      localStorage.cartStatus = saveCart;
    });
  });
}

window.onload = async () => {
  document.querySelectorAll(cartItems)[0]
  .innerHTML = localStorage.getItem('cartStatus');
  await showTheProducts();
  buttonToAdd();
  document.querySelectorAll('.cart__item')
  .forEach((value) => {
    value.addEventListener('click', cartItemClickListener);
  });
 };
