const cartItemsAll = '.cart__items';

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ id: sku, title: name, thumbnail: image }) => {
  const items = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return items.appendChild(section);
};

const saveLocalStorage = () => {
  const shoppingCart = document.querySelector(cartItemsAll);
  localStorage.setItem('cart', shoppingCart.innerHTML);
};

const sumTotalPrice = () => {
  let total = 0;
  const itemCart = document.querySelectorAll('.cart__item');
  itemCart.forEach((item) => {
    total += parseFloat(item.innerText.split('$')[1]);
  });
  document.querySelector('.total-price').innerText = total;
};

const cartItemClickListener = (event) => {
  event.target.remove();
  saveLocalStorage();
  sumTotalPrice();
};

const loadLocalStorage = () => {
  const cart = document.querySelector(cartItemsAll);
  if (localStorage.length !== 0) {
    cart.innerHTML = localStorage.getItem('cart');
  }
  cart.addEventListener('click', cartItemClickListener);
};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = sku;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const cathOl = (element) => {
  const chart = document.querySelector(cartItemsAll);
  chart.appendChild(element);
};

async function fetchToChart(id) {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  await fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      cathOl(createCartItemElement(data));
      sumTotalPrice();
      saveLocalStorage();
    });
}

const buttonAddItemCart = (item) => {
  const createDisplay = document.querySelector('.items');
  createDisplay.appendChild(item);
  item.addEventListener('click', (event) => {
    const getSku = event.currentTarget.firstChild.innerText;
    fetchToChart(getSku);
  });
};

async function getItensApi(query) {
  const loadingPage = document.querySelector('.loading');
  loadingPage.innerHTML = 'Loading...';
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  await fetch(endpoint)
    .then((response) => response.json())
    .then((object) => {
      const result = object.results;
      result.forEach((value) => {
        buttonAddItemCart(createProductItemElement(value));
      });
      document.querySelector('.loading').remove();
    })
    .catch((error) => {
      window.alert(error);
    });
}

const emptyCartButton = () => {
  const buttonClearCart = document.querySelector('.empty-cart');
  buttonClearCart.addEventListener('click', () => {
    const itemsCart = document.querySelectorAll('.cart__item');
    itemsCart.forEach((item) => {
      item.remove();
    });
    sumTotalPrice();
    saveLocalStorage();
  });
};

window.onload = function onload() {
  getItensApi('computador');
  loadLocalStorage();
  sumTotalPrice();
  emptyCartButton();
};