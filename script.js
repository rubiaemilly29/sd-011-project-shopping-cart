// requisito 5
const sumAll = () => {
  const items = document.querySelectorAll('.cart__item');
  const itemsArr = Array.from(items); //array de elementos html (li)
  const price = document.querySelector('.total-price');
  const total = itemsArr.reduce((acc, item) => acc + Number(item.innerText.split('$')[1]), 0);
  price.innerText = `Preço Total: $${total.toFixed(2)}`;
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
  return item.querySelector('.item__sku').innerText;
}

function cartItemClickListener(event) {
  // requisito 3
  const cartList = document.querySelector('.cart__items');
  cartList.removeChild(event.target);
  // requisito 4
  localStorage.setItem('cartList', cartList.innerHTML);
  sumAll();
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

const catchItem = async (event) => {
  const itemID = getSkuFromProductItem(event.target.parentElement); // catch product id
  const prodList = document.querySelector('.cart__items');
  const prod = await fetchItem(itemID);
  const item = createCartItemElement({ sku: prod.id, name: prod.title, salePrice: prod.price });
  prodList.appendChild(item);
  // requisito 4
  localStorage.setItem('cartList', prodList.innerHTML); // salva localmente a lista de produtos selecionados
  // 
  sumAll();
};

const addCartItemAndCreateProductList = async () => {
  await createProductList();
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', catchItem));
}; 

const loadLocalStorage = () => {
  // requisito 4 - se houver lista no stoge, insere na OL e adiciona o addEventListener
  if (localStorage.getItem('cartList')) {
    const cartListOL = document.querySelector('ol.cart__items');
    cartListOL.innerHTML = localStorage.getItem('cartList');
    const cartListProducts = document.querySelectorAll('.cart__item');
    cartListProducts.forEach((item) => item.addEventListener('click', cartItemClickListener));
  }
  sumAll();
};

window.onload = function onload() { 
  addCartItemAndCreateProductList();
  loadLocalStorage();
};