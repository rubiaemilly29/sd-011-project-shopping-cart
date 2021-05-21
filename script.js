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
//     return item.querySelector('span.item__sku').innerText;
//   }

function sum() {
  const totalPrice = document.querySelector('.total-price');
  const cartList = document.querySelectorAll('.cart__item');
  const arr = [0];
  cartList.forEach((item) => {
    const value = item.innerHTML.split('$')[1];
    arr.push(Number(value));
  });
  const total = arr.reduce((acc, item) => {
    const result = acc + item;
    return Number(result.toFixed(2));
  });
  totalPrice.innerHTML = total;
}

function cartItemClickListener(event) {
  event.target.remove();
  sum();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function localSave() {
  const olList = document.querySelector('ol');
  const items = olList.innerHTML;
  localStorage.setItem('cart', items);
}

function getLocal() {
  const olList = document.querySelector('ol');
  olList.innerHTML = localStorage.getItem('cart');
}

function getListItem() {
  const cart = document.querySelector('.cart__items');
  const buttons = document.querySelectorAll('.item');
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const selectedItem = event.target.parentElement;
      const itemId = selectedItem.firstChild.innerText;
      fetch(`https://api.mercadolibre.com/items/${itemId}`)
        .then((response) => response.json())
        .then((json) => {
          const cartItem = { sku: json.id, name: json.title, salePrice: json.price };
          const itemCart = createCartItemElement(cartItem);
          cart.appendChild(itemCart);
        })
        .then(() => localSave())
        .then(() => sum());
    });
  });
}

function siteList() {
  const body = document.querySelector('body');
  const load = body.appendChild(createCustomElement('h2', 'loading', 'Loading...'));
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((json) => {
      const productBlock = document.querySelector('.items');
      json.results.forEach((product) => {
        const productList = { sku: product.id, name: product.title, image: product.thumbnail };
        const products = createProductItemElement(productList);
        productBlock.appendChild(products);
      });
    })
    .then(() => body.removeChild(load))
    .then(() => getListItem())
    .then(() => sum());
}

function clearButton() {
  const olList = document.querySelector('ol');
  const clear = document.querySelector('.empty-cart');
  const totalPrice = document.querySelector('.total-price');
  clear.addEventListener('click', () => {
    olList.innerHTML = '';
    localStorage.clear();
    totalPrice.innerText = '0';
  });
}

window.onload = function onload() {
  siteList();
  clearButton();
  getLocal();
};