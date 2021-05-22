function cartItemClickListener(event) {
  localStorage.removeItem(event.target.innerText.substr(5, 13));
  const parent = event.target.parentNode;
  parent.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item'; 
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return document.querySelector('.cart__items').appendChild(li);
}

async function buttonFetch(event) {
  const itemId = event.target.parentNode.firstElementChild.innerHTML;
  const API_URL = `https://api.mercadolibre.com/items/${itemId}`;
  fetch(API_URL)
     .then((r) => r.json())
     .then((r) => { 
       createCartItemElement(r);
       localStorage.setItem(`${r.id}`, `${r.id}|${r.title}|${r.price}`);
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
  let button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button = section.appendChild(button);
  button.addEventListener('click', buttonFetch);
  return document.querySelector('.items').appendChild(section);
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function loading() {
  const image = createProductImageElement('loader3.gif');
  image.className = 'loading';
  document.querySelector('.items').appendChild(image);
}

function end() {
  const parent = document.querySelector('.loading').parentNode;
  parent.removeChild(document.querySelector('.loading'));
}

function emptyButtonListener() {
  console.log(document.querySelector('empty-cart'));
  document.querySelector('.empty-cart').addEventListener('click', () => {
    localStorage.clear();
    const fatherNode = document.querySelector('.cart__items');
    while (fatherNode.firstChild) {
      fatherNode.removeChild(fatherNode.lastChild);
    }
  });
}

async function fetchItems() {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(API_URL)
    .then((r) => r.json())
    .then((r) => r.results.map((resultItem) => createProductItemElement(resultItem)));
}

function loadSavedItems() {
  const savedItems = Object.keys(localStorage);
  savedItems.forEach((key) => {
    const data = localStorage.getItem(key).split('|');
    createCartItemElement({ id: data[0], title: data[1], price: data[2] });
  });
}

window.onload = async function onload() {
  loading();
  await fetchItems()
  .then(loadSavedItems)
  .then(emptyButtonListener)
  .then(setTimeout(end, 3000));
};