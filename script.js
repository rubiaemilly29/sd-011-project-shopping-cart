/*
Para o desenvolvimento da parte que aborda web storage, consultei o código do Lima, Lima, Turma 11 da Trybe, o qual tornou
menos abstrato que eu queria fazer.
Link para o cod do Lima, Lima:
https://github.com/tryber/sd-011-project-shopping-cart/pull/79/commits/d264abdbb76f382a8a91e60643bf745bbc2a5393
*/

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

const cartListClass = '.cart__items';
const totalPriceClass = '.total-price';

function cartItemClickListener(event) {
  // coloque seu código aqui
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

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

// A função abaixo solicita da API a lista de produtos do tipo computador
async function fetchProducts() {
  return fetch(API_URL)
    .then((product) => product.json())
    .then((product) => product.results);
}

// A função abaixo adiciona a lista de produtos do tipo computador numa seção da estrutura HTML
async function addProducts() {
  const arrayOfProducts = await fetchProducts();
  arrayOfProducts.forEach((product) => {
    document.querySelector('.items').appendChild(createProductItemElement(product));
  });
}

const PRODUCT_URL = 'https://api.mercadolibre.com/items/$ItemID';

// A função abaixo solicita da API o item passado como parâmetro
async function fetchAddProduct(itemId) {
  return fetch(PRODUCT_URL.replace('$ItemID', itemId))
    .then((product) => product.json())
    .then((product) => product);
}
// Adiciona o produto ao carrinho e ao storage
async function addProductToCart() {
  await addProducts();
  const buttonsAdd = document.querySelectorAll('.item__add');
  buttonsAdd.forEach((button) => button.addEventListener('click', async (e) => {
    const productID = getSkuFromProductItem(e.target.parentElement);
    const productData = await fetchAddProduct(productID); // busca na API o produto que recebeu o clique
    const cartList = document.querySelector(cartListClass);
    cartList.appendChild(createCartItemElement(productData)); // adiciona o produto ao carrinho
    localStorage.setItem('cart', cartList.innerHTML);
    const ttPrice = document.querySelector(totalPriceClass);
    localStorage.setItem('payment', Number(ttPrice.innerText) + productData.price);
    ttPrice.innerText = localStorage.getItem('payment');
  }));
}

// A função resgata os produtos anteriormente adicionados ao carrinho
function loadCurrentCart() {
  const currentCart = localStorage.getItem('cart');
  const cartList = document.querySelector(cartListClass);
  cartList.innerHTML = currentCart;
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((cartItem) => cartItem.addEventListener('click', cartItemClickListener));
  const ttPrice = document.querySelector(totalPriceClass);
  ttPrice.innerText = localStorage.getItem('payment');
}

window.onload = function onload() {
  fetchProducts();
  loadCurrentCart();
  addProductToCart();
};