const recoverTotalSum = () => document.querySelector('.total-price');
const recoverCartItems = () => document.querySelector('.cart__items');
const shoppingCart = 'shopping-cart';

function saveItem(sku, name, salePrice) {
  let arrayshoppingCart = [];
  if (Object.keys(localStorage).length > 0) {
    arrayshoppingCart = JSON.parse(localStorage.getItem(shoppingCart));
  }
  arrayshoppingCart.push(`${sku}|${name}|${salePrice}`);
  localStorage.setItem(shoppingCart, JSON.stringify(arrayshoppingCart));
}

function createSumPrice() {
  const listCart = recoverCartItems().childNodes;
  const arrayPrices = [];
  listCart.forEach((item) => arrayPrices.push(Number(item.innerHTML.split('$')[1])));
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

// https://stackoverflow.com/questions/48977577/how-to-get-the-index-of-the-li-clicked-in-javascript
function cartItemClickListener(event) { // para remover da lista
  const li = event.target.closest('li');
  const nodes = Array.from(recoverCartItems().children);
  const index = nodes.indexOf(li);
  const newShoppingCart = JSON.parse(localStorage.getItem(shoppingCart)).splice(index, 1);
  localStorage.setItem(shoppingCart, JSON.stringify(newShoppingCart));
  event.target.remove();
  createSumPrice();
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
  window.localStorage.clear();
  createSumPrice();
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
  try {
    const currentId = await getSkuFromProductItem((event.target).parentNode);
    const response = await fetch(`https://api.mercadolibre.com/items/${currentId}`);
    const json = await response.json();
    const objectItem = {
      sku: json.id,
      name: json.title,
      salePrice: json.price,
    };
    recoverCartItems().appendChild(createCartItemElement(objectItem));
    createSumPrice();
    saveItem(json.id, json.title, json.price);
  } catch (error) {
    alert('ao clicar botão de adicionar ao carrinho');
  }
}

function openShoppingCart() {
  if (Object.keys(localStorage).length > 0) {
    const savedShoppingCart = JSON.parse(localStorage.getItem(shoppingCart));
    savedShoppingCart.forEach((productCart) => {
      const [sku, name, salePrice] = productCart.split('|');
      recoverCartItems().appendChild(createCartItemElement({ sku, name, salePrice }));
    });
  }
  createSumPrice();
}

async function createObjectButtons() {
  try {
    await getItemsFromAPI('computador');
    const objectButtonsAdd = document.querySelectorAll('.item__add');
    objectButtonsAdd.forEach((button) => button.addEventListener('click', addItemToCart));
  } catch (error) {
    alert('erro ao criar objeto com os botões adicionar ao carrinho');
  }
}

async function showBody() {
  try {
    await createObjectButtons();
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
};
