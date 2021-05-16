const cartItens = document.querySelector('.cart__items');
let cartSave = [];

const saveCart = () => {
  const cartItem = [...document.getElementsByClassName('cart__item')];
  cartSave = [];
  cartItem.forEach((item, index) => {
    cartSave[index] = {
      tagName: item.outerHTML,
    };
  });
  localStorage.cartItensSave = (JSON.stringify(cartSave));
  console.log(JSON.stringify(cartSave));
};

const reloadCart = () => {
  const cart = JSON.parse(localStorage.cartItensSave);
  [...cart].forEach((item) => {
    const li = document.createElement('li');
    cartItens.appendChild(li);
    li.outerHTML = item.tagName;
  });
};

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

function cartItemClickListener(event) {
  if (event.target.className === 'cart__item') {
    const item = event.target;
    item.parentNode.removeChild(item);
    saveCart();
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const productAddToCart = () => {
  document.querySelector('.container').addEventListener(('click'), (event) => {
  const id = event.target;
  if (event.target.className === 'item__add') {
    fetch(`https://api.mercadolibre.com/items/${id.parentNode.firstChild.innerText}`)
      .then((response) => response.json())
        .then((response) => {
          const sku = response.id;
          const name = response.title;
          const salePrice = response.price;
          const productCart = createCartItemElement({ sku, name, salePrice });
          cartItens.appendChild(productCart);
        })
          .then(saveCart);
      }
  });
};

const createProduct = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((response) => response.json())
      .then((response) => response.results)
        .then((response) => {
          response.forEach((dado) => {
            const sku = dado.id;
            const name = dado.title;
            const image = dado.thumbnail;
            const product = createProductItemElement({ sku, name, image });
            document.querySelector('.items').appendChild(product);
          });
        })
          .then(productAddToCart);
};

window.onload = function onload() { 
  createProduct();
  reloadCart();
};