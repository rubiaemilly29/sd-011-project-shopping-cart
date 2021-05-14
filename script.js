const CARTITEMS = '.cart__items';

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveItemsLocalStorage() {
  const cart2 = document.getElementsByClassName('cart__items')[0].innerHTML;
  localStorage.setItem('myListItems', cart2);
}

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  saveItemsLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function handleButtonAdd(event) {
  const sku = event.target.parentElement.querySelector('.item__sku').innerText;
  // OU getSkuFromProductItem(event.target.parentElement)
  // console.log(sku);
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json())
    .then((response) => {
      const li = createCartItemElement({ sku: response.id, 
        name: response.title,
        salePrice: response.price });
      const cart1 = document.querySelector(CARTITEMS);
      cart1.appendChild(li);
      saveItemsLocalStorage();
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonElement = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonElement.addEventListener('click', handleButtonAdd);
  section.appendChild(buttonElement);

  return section;
}

function cleanCart() {
  const ol = document.querySelector(CARTITEMS);
  ol.innerHTML = ' ';
  saveItemsLocalStorage();
}

function loadFromLocalStorage() {
  const savedItems = window.localStorage.getItem('myListItems');
  document.querySelector(CARTITEMS).innerHTML = savedItems;
  let liItemsSaved = document.getElementsByClassName('cart__item');
  liItemsSaved = Array.from(liItemsSaved);
  liItemsSaved.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
}

function loadProductsFromAPI() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((body) => {
    console.log(body);
    const items = document.querySelector('.items');
    body.results.forEach((value) => {
      const obj = { sku: value.id, name: value.title, image: value.thumbnail };
      items.appendChild(createProductItemElement(obj));
    });
  });
}

window.onload = function onload() {
  loadFromLocalStorage();

  loadProductsFromAPI();

  const buttonEmpty = document.querySelector('.empty-cart');
  buttonEmpty.addEventListener('click', cleanCart);
};