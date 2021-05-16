const recoverTotalSum = () => document.querySelector('.total-price');
const recoverCartItems = () => document.querySelector('.cart__items');

function saveItems() {
  localStorage.setItem('shoppingCart', recoverCartItems().innerHTML);
  localStorage.setItem('totalSum', recoverTotalSum().innerHTML);
}

async function createSumPrice() {
  const listCart = recoverCartItems().childNodes;
  const arrayPrices = [];
  listCart.forEach((item) => arrayPrices.push(Number(item.innerText.split('$')[1])));
  const totalSum = arrayPrices.reduce((accPrice, price) => accPrice + price, 0);
  recoverTotalSum().innerText = Math.round(totalSum * 100) / 100;
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

function cartItemClickListener(event) { // para remover da lista
  event.target.remove();
  createSumPrice();
  saveItems();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function render(json) {
  json.results.forEach((element) => {
    const newObject = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    const newItem = createProductItemElement(newObject);
    const sectionItems = document.querySelector('.items');
    sectionItems.appendChild(newItem);
  });
}

function emptyCart() {
  const listCart = document.querySelectorAll('.cart__item');
  listCart.forEach((item) => item.remove());
  createSumPrice();
  saveItems();
}

function checkButtonEmptyCart() {
  const butttonEmptyCart = document.querySelectorAll('.empty-cart')[0];
  butttonEmptyCart.addEventListener('click', emptyCart);
}

async function getItemsFromAPI(term) {
  try {
    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}#json`);
    const json = await response.json();
    render(json);
  } catch (error) {
    alert('algo de errado não está certo');
  }
}

async function addItemToCart(event) {
  const currentId = await getSkuFromProductItem((event.target).parentNode);
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${currentId}`);
    const json = await response.json();
    const objectItem = {
      sku: json.id,
      name: json.title,
      salePrice: json.price,
    };
    const cartItem = createCartItemElement(objectItem);
    recoverCartItems().appendChild(cartItem);
    createSumPrice();
    saveItems();
  } catch (error) {
    alert('ao clicar botão de adicionar ao carrinho');
  }
}

function openShoppingCart() {
  const savedShoppingCart = localStorage.getItem('shoppingCart');
  const savedTotalSum = localStorage.getItem('totalSum');
  recoverCartItems().innerHTML = savedShoppingCart;
  recoverTotalSum().innerHTML = savedTotalSum;
}

async function createObjectButtons() {
  await getItemsFromAPI('computador');
  try {
    const objectButtonsAdd = document.querySelectorAll('.item__add');
    objectButtonsAdd.forEach((button) => button.addEventListener('click', addItemToCart));
  } catch (error) {
    alert('erro ao criar objeto com os botões adicionar ao carrinho');
  }
}

async function showBody() {
  await createObjectButtons();
  try {
    document.querySelector('.loading').remove();
    document.querySelector('body').style.visibility = 'visible';
  } catch (error) {
    alert('não deu certo o showBody');
  }
}

// https://blog.hellojs.org/create-a-very-basic-loading-screen-using-only-javascript-css-3cf099c48b19
// https://www.geeksforgeeks.org/how-to-show-page-loading-div-until-the-page-has-finished-loading/

window.onload = function onload() { 
  showBody();
  checkButtonEmptyCart();
  openShoppingCart();
  createSumPrice();
};

// $(window).load(function() {
//   document.querySelector('.loading').style.display = 'none';
//   document.querySelector('body').style.display = 'inline';
// }

// Não apaga quando salvo no localstorage. Isso acontece porque não foi criado dinamicamente?
// Questão do preço total está confusa (feito separando valor do cart__items). Qual melhor maneira?
// Funções 'soma preço' e 'salvar no localstorage' foram colocadas no addItemToCart, emptyCart e cartItemClickListener. A lógia é mesmo essa? 
// Verificar lógica das funções assíncronas.
// Coloca esse mói de coisa no window.onload mesmo?
// Linter reclamando de criar a mesma constante várias vezes. Mas considerando as funções assíncronas, daria certo criá-las uma vez no corpo principal do JS? Para parar de reclamar, fiz uma função que gera a constante.