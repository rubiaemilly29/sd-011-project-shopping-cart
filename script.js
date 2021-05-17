const cartItens = '.cart__items';
const cartItem = '.cart__item';

function clearCart() {
  const btnClearItens = document.querySelector('.empty-cart');
  const spanCartValue = document.querySelector('.total-price');
  btnClearItens.addEventListener('click', async () => {
    const liItens = document.querySelectorAll(cartItem);
    liItens.forEach((li) => li.remove());
    spanCartValue.innerHTML = '<h3>R$00.00</h3>';
    localStorage.clear();
  });
}

async function sumValues() {
  const itensCart = document.querySelectorAll(cartItem);
  const spanValor = document.querySelector('.total-price');
  let sum = 0;
  if (itensCart.length === 0) spanValor.innerHTML = '<h3>R$00.00</h3>';
  itensCart.forEach((item) => {
    const prodValor = parseFloat(item.innerText.split('$')[1]);
    prodValor.toFixed(2);
    sum.toFixed(2);
    sum += prodValor;
    spanValor.innerHTML = `<h3>${sum}</h3>`;
  });
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

async function apiOnload() {
  const fetchRequisicao = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const json = await fetchRequisicao.json();
  json.results.forEach((result) => {
    const section = createProductItemElement(result);
    const sectionItens = document.querySelector('.items');
    sectionItens.appendChild(section);
    sumValues();
  });
} 

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const olCart = document.querySelector(cartItens);
  event.target.remove();
  localStorage.setItem('carrinho', olCart.innerHTML);
  sumValues();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function eventAddCart() {
  const btnItems = document.querySelector('.items');
  btnItems.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') {
      const ItemID = event.target.parentNode.firstChild.innerText;
      const apiReturn = await fetch(`https://api.mercadolibre.com/items/${ItemID}`);
      const jsonApi = await apiReturn.json();
      const li = createCartItemElement(jsonApi);
      const olCart = document.querySelector('.cart__items');
      olCart.appendChild(li);
      localStorage.setItem('carrinho', olCart.innerHTML);
      sumValues();
    }
  });
}

window.onload = function onload() {
  apiOnload();
  eventAddCart();
  if (localStorage.carrinho) {
    const olCart = document.querySelector(cartItens);
    olCart.innerHTML = localStorage.getItem('carrinho');
    const itemCart = document.querySelectorAll(cartItem);
    console.log(itemCart);
    itemCart.forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
      sumValues();
    });
  }
  clearCart();
};
