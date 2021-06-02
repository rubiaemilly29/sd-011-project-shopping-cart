let shopList;

function currentShopList() {
   shopList = document.querySelector('.cart__items');
}

function storageCart() {
  window.localStorage.cartList = shopList.innerHTML;
}

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  const createItems = document.querySelector('.items');
  createItems.appendChild(section);
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  shopList.removeChild(event.target);
  storageCart();
  }

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addProductToCart = (event) => {
  if (event.target.className === 'item__add') {
    const getID = getSkuFromProductItem(event.target.parentNode);
    fetch(`https://api.mercadolibre.com/items/${getID}`)
      .then((resposta) => resposta.json())
      .then((json) => {
        shopList.appendChild(createCartItemElement(json));
        storageCart();
      });
  }
};
const createPromisse = () => {
  let products;
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json().then((produtos) => {
        products = produtos.results;
        products.forEach((product) => {
          createProductItemElement(product);
        });
      });
    });
};

// A idéia da função callProduct é da Ana Ventura turma 10-A
const callProduct = async () => {
  try {
    await createPromisse();
  } catch (error) {
    console.log(error);
  }
};

function shopCart() {
  const list = document.querySelector('.cart__items');
  const { cartList } = window.localStorage;
  if (!cartList) list.innerHTML = '';
  else list.innerHTML = cartList;
}

function deleteShopCart() {
  const li = document.querySelectorAll('.cart__item');
  li.forEach((item) => item.addEventListener('click', cartItemClickListener));
}

window.onload = function onload() { 
  callProduct();
  const getOl = document.querySelector('.items');
  getOl.addEventListener('click', addProductToCart);
  shopCart();
  deleteShopCart();
  currentShopList();
};