const cart = '.cart__items';

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const sumPrices = () => {
  const items = document.querySelectorAll('.cart__item');
  let priceTotal = 0;
  items.forEach((item) => {
    const text = item.innerText;
    priceTotal += parseFloat(text.split('$')[1]);
  });
  const priceScreen = document.querySelector('.total-price');
  priceScreen.innerText = priceTotal;
};

function cartItemClickListener(event) {
  const cart3 = document.querySelector(cart);
  cart3.removeChild(event.target);
  const cartItems = cart3.innerHTML;
  localStorage.setItem('cartItems', cartItems);
  sumPrices();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = async () => {
  const cart2 = document.querySelector(cart);
  const buttonAdd = document.querySelectorAll('.item__add');
  buttonAdd.forEach((button) => {
    button.addEventListener('click', async () => {
      const finalUrl = button.previousElementSibling.previousElementSibling
        .previousElementSibling.innerText;
      const objtectCarAdd = await fetch(`https://api.mercadolibre.com/items/${finalUrl}`);
      const objtectCarAddJson = await objtectCarAdd.json();
      const objectAddCart = await createCartItemElement(objtectCarAddJson);
      cart2.appendChild(objectAddCart);
      const cartItems = cart2.innerHTML;
      localStorage.setItem('cartItems', cartItems);
      sumPrices();
    });
  });
};

const removeLoading = () => {
  const message = document.querySelector('.loading');
  document.body.removeChild(message);
};

const fetchItems = async (url) => {
  const items = document.querySelector('.items');
  const computers = await fetch(url);
  removeLoading();
  const computersJson = await computers.json();
  await computersJson.results.forEach((result) => {
    const element = createProductItemElement(result);
    items.appendChild(element);
  });
  addToCart();
};

const emptyCart = () => {
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', () => {
  const cart3 = document.querySelector(cart);
  cart3.innerHTML = '';
  localStorage.setItem('cartItems', cart3.innerHTML);
  sumPrices();
  });
};

const loading = () => {
  const message = document.createElement('h1');
  message.className = 'loading';
  message.innerText = 'loading...';
  document.body.appendChild(message);
};

window.onload = function onload() {
  loading();
  fetchItems('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const cart1 = document.querySelector(cart);
  if (localStorage.cartItems) {
    cart1.innerHTML = localStorage.getItem('cartItems');
    const itemsCart = document.querySelectorAll('.cart__item');
    itemsCart.forEach((itemCart) => {
      itemCart.addEventListener('click', cartItemClickListener);
    });
    sumPrices();
  }
  emptyCart();
};
