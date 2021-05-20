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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// Requisito 5
function payment() {
  const payout = document.querySelector('.total-price');
  const listItems = [...document.querySelectorAll('.cart__item')];
  payout.innerText = 0;
  const sum = listItems.reduce((acc, cv) => acc + Number(cv.innerText.split('PRICE: $')[1]), 0);
  // payout.innerText = `Total a pagar: $${sum}`;
  payout.innerText = sum;
}

// Requisito 3
function cartItemClickListener(event) {
  event.target.remove();
  payment();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event));
  return li;
}

// Requisito 2
function addProductToCart() {
  const btnAddItems = document.querySelectorAll('.item__add');
  btnAddItems.forEach((element) => element.addEventListener('click', () => {
    const idItem = element.parentElement.firstChild.innerText;
    fetch(`https://api.mercadolibre.com/items/${idItem}`)
    .then((resp) => resp.json())
    .then((data) => {
      const ol = document.querySelector('ol');
      const count = ol.childElementCount;
      localStorage.setItem('TotalItems', `${count}`);
      localStorage.setItem(`Item${count}`, 
      `SKU: ${data.id} | NAME: ${data.title} | PRICE: $${data.price}`);
      document.querySelector('.cart__items').appendChild(createCartItemElement(data));
    })
    .then(() => payment());
  }));
}

// Requisito 1
const apiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function listItems() {
  fetch(apiUrl)
  .then((response) => response.json())
  .then((response) => response.results.forEach((item) => {
    const itemToFind = { sku: item.id, name: item.title, image: item.thumbnail };
    const items = document.querySelector('.items');
    items.appendChild(createProductItemElement(itemToFind));
  }))
  .then(() => addProductToCart())
  .then(() => {
    document.querySelector('.loading').remove();
    console.log(document.querySelector('.loading'));
  })
  .catch((err) => console.log(err));
}

// Requisito 6
function clearCart() {
  const btnClear = document.querySelector('.empty-cart');  
  btnClear.addEventListener('click', () => {
    const payout = document.querySelector('.total-price');
    const cartToCart = document.querySelector('.cart__items');
    cartToCart.innerHTML = '';
    payout.innerHTML = 0;
    payout.innerText = '';
    localStorage.clear();
  });
}

// Requisito 4
function backupListItem() {
  if (localStorage.getItem('TotalItems') > 0) {
    for (let index = 0; index <= localStorage.getItem('TotalItems'); index += 1) {
      const cartItems = document.querySelector('.cart__items');
      const li = document.createElement('li');
      li.className = 'cart__item';
      cartItems.appendChild(li);
      li.innerText = localStorage.getItem(`Item${index}`);
    }
  }
}

window.onload = function onload() {
  backupListItem();
  listItems();
  payment();
  clearCart();
};
