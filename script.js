const ol = '.cart__items';
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

function cartItemClickListener(event) {
  const productOnList = document.querySelector(ol);
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

  localStorage.setItem('products', productOnList.innerHTML);
}

function getList() {
  return new Promise((resolve, reject) =>
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((computer) => computer.json())
  .then((json) => json.results)
  .then((result) => resolve(result.forEach((x) => createProductItemElement(x)))));
}

function insertItens() {
  const buttons = document.querySelectorAll('.item__add');
  const code = document.querySelectorAll('.item__sku');
  buttons.forEach((botao, index) => botao.addEventListener('click', () => 
    fetch(`https://api.mercadolibre.com/items/${code[index].innerText}`)
    .then((response) => response.json())
    .then((j) => createCartItemElement({ sku: [j.id], name: [j.title], salePrice: [j.price] }))));
}

window.onload = function onload() { 
  getList().then(() => insertItens());
  const productOnList = document.querySelector(ol);
  productOnList.innerHTML = localStorage.getItem('products');
};