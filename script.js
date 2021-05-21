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

const createLoading = () => {
  const loading = document.createElement('span');
  loading.className = 'loading';
  const container = document.querySelector('.container');
  container.appendChild(loading);
  loading.innerText = 'Loading...';
  console.log(loading);
};

const excludeLoading = () => {
  const loading = document.querySelector('.loading');
  loading.remove();
};

const filterJsonData = async () => {
  createLoading();
  const rawData = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  excludeLoading();
  const json = await rawData.json();
  const resultData = json.results;
  const filteredData = resultData.map((product) => (
    { sku: product.id, name: product.title, image: product.thumbnail }
    ));
  return filteredData;
  };

  // const totalSum = () => {
    const priceText = document.createElement('span');
    const priceValue = document.createElement('span');
    priceText.innerText = 'Preço total: $';
    const priceBox = document.querySelector('.total-price');
    priceBox.appendChild(priceText);
    priceBox.appendChild(priceValue);
  // };
  
const updateTotalSum = () => {
  const cartItems = document.querySelectorAll('.cart__item');
  const cartArray = [...cartItems];

  const sumOfItems = cartArray
    .map((item) => item.innerText.split('$')[1])
    .reduce((acc, item) => acc + parseFloat(item), 0);

  priceBox.innerText = sumOfItems;
  return priceBox.innerText;
};

function cartItemClickListener(event) {
  // const id = event.target.innerHTML.split(' ')[1];
  const cart = event.target.parentNode;
  cart.removeChild(event.target);
  localStorage.setItem('cart', cart.innerHTML);
  updateTotalSum();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.querySelector('.cart__items').appendChild(li);
  
  localStorage.setItem('cart', li.parentElement.innerHTML);
  
  return li;
}

const addToCart = async (event) => {
  const id = getSkuFromProductItem(event.target.parentElement);
  const file = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const data = await file.json();
  const filteredData = { sku: data.id, name: data.title, salePrice: data.price };
  
  createCartItemElement(filteredData);
  updateTotalSum();
};

// Display produtos na página.
const displayProductsOnPage = async () => {
  const filteredData = await filterJsonData();
  filteredData.forEach((data) => {
    const newProduct = createProductItemElement(data);
    document.querySelector('.items').appendChild(newProduct);
    const button = newProduct.children[3];
    button.addEventListener('click', addToCart);
  });
};

// Botão esvaziar carrinho.
const createButtomClearCart = () => {
  const clearButtom = document.querySelector('.empty-cart');
  clearButtom.addEventListener('click', () => {
    const cartItems = document.querySelector('ol').children;
    const cartItemsArray = [...cartItems];

    cartItemsArray.forEach((item) => {
      item.remove();
    });
    localStorage.clear();
  });
};

window.onload = function onload() {
  filterJsonData();
  displayProductsOnPage();
  createButtomClearCart();

  const shoppingCart = localStorage.getItem('cart');
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = shoppingCart; 
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((item) => item.addEventListener('click', cartItemClickListener));
  };
