// Para o desenvolvimento do projeto usei partes do codigo do Luan Alexandre como base
// https://github.com/tryber/sd-011-project-shopping-cart/tree/luan-alexandre-projeto-shopping-cart
const apiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const PRODUCT_URL = 'https://api.mercadolibre.com/items/$ItemID';
const cartListClass = '.cart__items';
const totalPriceClass = '.total-price';

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

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const cartList = document.querySelector(cartListClass);
  cartList.removeChild(event.target);
  localStorage.setItem('cart', cartList.innerHTML);
  let actualPrice = Math.fround((localStorage.getItem('payment'))).toFixed(1);
  console.log('valor atual', actualPrice);
  const productPrice = parseFloat((event.target.innerText.split('$')[1])).toFixed(1);
  console.log('valor do produto', productPrice);
  actualPrice -= productPrice;
  localStorage.setItem('payment', actualPrice);
  document.querySelector(totalPriceClass).innerText = Math.fround(actualPrice).toFixed(1);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// chama a API
async function fetchProducts() {
  return fetch(apiUrl)
    .then((product) => product.json())
    .then((product) => product.results);
}
// cria um section com o retorno da API
async function addProducts() {
  const arrayOfProducts = await fetchProducts();
  arrayOfProducts.forEach((product) => {
    document.querySelector('.items').appendChild(createProductItemElement(product));
  });
}
// A função abaixo solicita da API o item passado como parâmetro
async function fetchAddProduct(itemId) {
  return fetch(PRODUCT_URL.replace('$ItemID', itemId))
    .then((product) => product.json())
    .then((product) => product);
}

async function addProductToCart() {
  await addProducts();
  const buttonsAdd = document.querySelectorAll('.item__add');
  buttonsAdd.forEach((button) => button.addEventListener('click', async (e) => {
    const productID = getSkuFromProductItem(e.target.parentElement);
    const productData = await fetchAddProduct(productID); // busca na API o produto que foi clicado
    const cartList = document.querySelector(cartListClass);
    cartList.appendChild(createCartItemElement(productData)); // adiciona o produto ao carrinho
    localStorage.setItem('cart', cartList.innerHTML);
    const ttPrice = document.querySelector(totalPriceClass);
    localStorage.setItem('payment', Number(ttPrice.innerText) + productData.price);
    ttPrice.innerText = localStorage.getItem('payment');
  }));
}
// A função pega os produtos anteriormente adicionados ao carrinho
function loadCurrentCart() {
  const currentCart = localStorage.getItem('cart');
  const cartList = document.querySelector(cartListClass);
  cartList.innerHTML = currentCart;
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((cartItem) => cartItem.addEventListener('click', cartItemClickListener));
  const ttPrice = document.querySelector(totalPriceClass);
  ttPrice.innerText = localStorage.getItem('payment');
}

function btnClearCart() {
  const btnClear = document.querySelector('.empty-cart');
  btnClear.addEventListener('click', () => {
    const cartList = document.querySelector('.cart__items');
    while (cartList.firstChild) {
      cartList.removeChild(cartList.firstChild);
    }
    localStorage.setItem('payment', 0);
    document.querySelector('.total-price').innerText = 0;
  });
}

window.onload = function onload() {
  fetchProducts();
  addProductToCart();
  loadCurrentCart();
  btnClearCart();
}; 