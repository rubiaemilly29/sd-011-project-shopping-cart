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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function removeItemCart() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      const selectedItem = event.target;
      selectedItem.innerHTML = '';
    }
  });
}

function addItemToCart() {
  const items = document.querySelector('.items');
  items.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const itemID = event.target.parentElement.firstChild.innerText;
      return new Promise((resolve, reject) => {
        fetch(`https://api.mercadolibre.com/items/${itemID}`)
        .then((response) => response.json())
        .then((data) => {
          const cartItem = createCartItemElement(data);
          const cartItems = document.querySelector('.cart__items');
          cartItems.appendChild(cartItem);
        });
      });
    }
  });
}

function fetchAPI() {
  return new Promise((resolve, reject) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => data.results.forEach((result) => {
      const productItem = createProductItemElement(result);
      const items = document.querySelector('.items');
      items.appendChild(productItem);
    }));
    addItemToCart();
    removeItemCart();
  });
}

window.onload = function onload() { 
  fetchAPI();
};
