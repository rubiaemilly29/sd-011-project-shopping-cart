const getOl = '.cart__items';
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

const showSumPrice = () => {
  const totalPrice = document.querySelector('.total-price');
  const cartItem = [...document.querySelectorAll('.cart__item')];
  const getPrice = cartItem
  .reduce((acc, currVal) => acc + Number(currVal.innerText.split('$')[1]), 0);
  totalPrice.innerText = getPrice;
};

function cartItemClickListener(event, count) {
  localStorage.removeItem(`Item ${count}`); // remove item - local storage
  event.target.remove();
  showSumPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }, count) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, count));
  return li;
}

const addItemsCart = () => {
  const btnCart = document.querySelectorAll('.item__add');
  const getItems = document.querySelector(getOl);
  btnCart.forEach((items) => {
    items.addEventListener('click', () => {
      const sku = items.parentElement.firstChild.innerText;
      const count = getItems.childElementCount;
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then((result) => result.json())
        .then((data) => getItems.appendChild(createCartItemElement(data, count)))
        .then(() => showSumPrice());
      localStorage.setItem(`Item ${count}`, sku); // save - localStorage
    });
  });
};

const keepCartStored = () => {
  const cart = document.querySelector(getOl);
  for (let i = 0; i < localStorage.length; i += 1) {
    const getStorage = localStorage.getItem(`Item ${i}`);
    fetch(`https://api.mercadolibre.com/items/${getStorage}`)
      .then((result) => result.json())
      .then((data) => cart.appendChild(createCartItemElement(data, i)));
  }
};

const fetchProduct = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => data.results.forEach(({ id, title, thumbnail }) => {
      const selecItem = document.querySelector('.items');
      const listProduct = createProductItemElement({ sku: id, name: title, image: thumbnail });
      selecItem.appendChild(listProduct);
    }))
    .then(() => addItemsCart())
    .then(() => keepCartStored());
};

const clearCart = () => {
  const btnEmpty = document.querySelector('.empty-cart');
  btnEmpty.addEventListener('click', () => {
    const getCart = document.querySelector(getOl);
    getCart.innerHTML = '';
    localStorage.clear();
  });
};

window.onload = () => {
  fetchProduct();
  clearCart();
};
