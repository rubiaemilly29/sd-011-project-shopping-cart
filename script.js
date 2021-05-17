const ol = '.cart__items';
const totalPrice = '.total-price';

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

  const productsOnScreen = document.querySelector('.items');
  productsOnScreen.appendChild(section);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

let price = 0;
function increasePrice(singlePrice) {
  const priceHTML = document.querySelector(totalPrice);
  price += parseFloat(singlePrice);
  // https://stackoverflow.com/questions/3612744/remove-insignificant-trailing-zeros-from-a-number tirado desse link para conversão do ultímo zero restante
  priceHTML.innerText = `${price.toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')}`;
}

function decreasePrice(singlePrice) {
  const priceHTML = document.querySelector(totalPrice);
  price -= parseFloat(singlePrice);
  // https://stackoverflow.com/questions/3612744/remove-insignificant-trailing-zeros-from-a-number tirado desse link para conversão do ultímo zero restante
  priceHTML.innerText = `${price.toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')}`;
}

function cartItemClickListener(event) {
  const productOnList = document.querySelector(ol);
  const text = event.target.innerText;
  const index = text.indexOf('$');
  const priceCredit = parseFloat(text.substring(index + 1));
  decreasePrice(priceCredit);
  productOnList.removeChild(event.target);
  localStorage.setItem('products', productOnList.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  const productOnList = document.querySelector(ol);
  productOnList.appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  increasePrice(salePrice);

  localStorage.setItem('products', productOnList.innerHTML);
}

function getList() {
  return new Promise((resolve, reject) => 
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((computer) => computer.json())
  .then((json) => json.results)
  .then((result) => resolve(result.forEach((x) => createProductItemElement(x))))
  .then(() => {
    const teste = document.querySelector('.loading');
    const container = document.querySelector('.container');
    container.removeChild(teste);
  }));
}

function insertItens() {
  const buttons = document.querySelectorAll('.item__add');
  const code = document.querySelectorAll('.item__sku');
  buttons.forEach((botao, index) => botao.addEventListener('click', () => 
    fetch(`https://api.mercadolibre.com/items/${code[index].innerText}`)
    .then((response) => response.json())
    .then((j) => createCartItemElement({ sku: [j.id], name: [j.title], salePrice: [j.price] }))));
}

function eraseCart() {
  const eraseButton = document.querySelector('.empty-cart');
  const priceHTML = document.querySelector(totalPrice);
  eraseButton.addEventListener('click', function () {
  const cartList = document.querySelector(ol);
  const allItems = document.querySelectorAll('.cart__item');
  allItems.forEach((item) => cartList.removeChild(item));
  localStorage.clear();
  price = 0;
  priceHTML.innerText = price;
  });
}

window.onload = function onload() { 
  getList().then(() => insertItens());
  const productOnList = document.querySelector(ol);
  productOnList.innerHTML = localStorage.getItem('products');
  eraseCart();
};