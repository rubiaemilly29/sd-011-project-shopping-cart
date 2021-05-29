const cartItemsClass = '.cart__items';

const addCartStorage = () => {
  const addStorage = document.querySelector(cartItemsClass).innerHTML;
  localStorage.setItem('name', addStorage);
};

const actualStorage = () => {
  const cartItems = document.querySelector(cartItemsClass);
  const product = localStorage.getItem('name');
  cartItems.innerHTML = product;
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function sumTotalPrices() {
  const rememberCartItems = document.querySelector(cartItemsClass);
  const rememberTotalSum = document.querySelector('.total-price');
  const listCartItems = rememberCartItems.childNodes;
  const arrayPrices = [];
  listCartItems.forEach((item) => arrayPrices.push(Number(item.innerHTML.split('$')[1])));
  const sumPrices = arrayPrices.reduce((acc, curr) => acc + curr, 0);
  rememberTotalSum.innerText = Math.round(sumPrices * 100) / 100;
}

function cartItemClickListener(event) {
  event.target.remove();
  sumTotalPrices();
  addCartStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchItem(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((objectResponse) => objectResponse.json())
  .then((objectJson) => {
    const objectCart = {
      sku: objectJson.id, 
      name: objectJson.title,
      salePrice: objectJson.price,
    };
    const itemList = createCartItemElement(objectCart);
    const elementCart = document.querySelector(cartItemsClass);
    elementCart.appendChild(itemList);
    sumTotalPrices();
    addCartStorage();
  });
}

// const cartStorage = document.querySelectorAll('.cart__items');
// const addCartToStorage = () => {
  // 
// };

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonCreated = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonCreated.addEventListener('click', () => {
    fetchItem(sku);
    addCartStorage();
  });
  section.appendChild(buttonCreated);
  return section;
}

function addText() {
  const itemsClass = document.querySelector('.items');
  const loadText = document.createElement('span');
  loadText.innerText = 'loading...';
  loadText.className = 'loading';
  itemsClass.appendChild(loadText);
}

function createProductList() {
  addText();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((json) => {
      json.results.forEach((item) => {
        const objectFinded = { sku: item.id, name: item.title, image: item.thumbnail };
        const items = document.getElementsByClassName('items')[0];
        items.appendChild(createProductItemElement(objectFinded));      
      });
    })
    .then(() => {
      const loadingElement = document.querySelector('.loading');
      loadingElement.remove();
    });
}

function clearCartAll() {
  const rememberCartItems = document.querySelector(cartItemsClass);
  window.localStorage.clear();
  rememberCartItems.innerHTML = '';
  sumTotalPrices();
  addCartStorage();
}

function buttonClearCartAll() {
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', clearCartAll);
}

// const reloadStorage = () => {
//  const itemCart = localStorage.getItem('nome');
//  cartStorage.innerHTML = itemCart;
// };

// constfunction getSkuFromProductItem(item) {
//  return item.querySelector('span.item__sku').innerText;
// }

window.onload = function onload() {
  createProductList();
  buttonClearCartAll();
  actualStorage();
};
