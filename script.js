// const cart__items = document.querySelector('.cart__items');
// const items = document.querySelector('.items');

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

const cartItemClickListener = (event) => {
  document.querySelector('.cart__items').removeChild(event.target);
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  const cartItems = document.querySelector('.cart__items');
  localStorage.setItem(`item ${cartItems.childElementCount}`, `${sku}|${name}|${salePrice}`);
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

const createApiFetch = (seach) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${seach}`)
    .then((response) => response.json())
    .then((product) => {
      product.results.forEach((el) => {
        document.querySelector('.items').appendChild(createProductItemElement(el));
      });
    })
    .then(() => {
      document.querySelector('.cart').removeChild(document.querySelector('.loading'));
      for (let index = 0; index < localStorage.length; index += 1) {
        const [id, title, price] = localStorage.getItem(`item ${index}`).split('|');
        const total = { id, title, price };
        document.querySelector('.cart__items').appendChild(createCartItemElement(total));
      }
    });
};

const addCartItem = (event) => {
  if (event.target.className === 'item__add') {
    const id = getSkuFromProductItem(event.target.parentNode);
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json())
      .then((cartProduct) => {
        document.querySelector('.cart__items').appendChild(createCartItemElement(cartProduct));
      });
  }
};

window.onload = function onload() {
  createApiFetch('computador');
  document.querySelector('.items').addEventListener('click', addCartItem);
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    localStorage.clear();
  });
};
