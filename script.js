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

const getSkuFromProductItem = (item) => {
  return item.querySelector('span.item__sku').innerText;
};

const saveLocalStorage = () => {
  const searchOl = document.querySelector('.cart__items').outerHTML;
  localStorage.setItem('cart', searchOl);
};

const sumTotalPrice = () => {
  let total = 0;
  const itemCart = document.querySelectorAll('.cart__item');
  itemCart.forEach((item) => {
    total += parseFloat(item.innerText.split('$')[1]);
  });
  document.querySelector('.total-price').innerText = `${total}`;
};

const cartItemClickListener = (event) => {
  event.target.remove();
  saveLocalStorage();
  sumTotalPrice();
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
  const chart = document.querySelector('.cart__items');
  chart.appendChild(element);
};

const fetchToChart = (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      cathOl(createCartItemElement(data));
      sumTotalPrice();
      saveLocalStorage();
    });
};

const buttonAddItemCart = (item) => {
  const createDisplay = document.querySelector('.items');
  createDisplay.appendChild(item);
  item.addEventListener('click', (event) => {
    const getSku = event.currentTarget.firstChild.innerText;
    fetchToChart(getSku);
  });
};

const getEndPoint = (query) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  fetch(endpoint)
    .then((response) => response.json())
    .then((object) => {
      const result = object.results;
      result.forEach((value) => {
        buttonAddItemCart(createProductItemElement(value));
      });
    })
    .catch((error) => {
      window.alert(error);
    });
};

const loadLocalStorage = () => {
  if (localStorage.getItem('cart') !== null) {
    const searchOl = document.querySelector('.cart__items');
    searchOl.outerHTML = localStorage.getItem('cart');
    const searchItems = document.querySelectorAll('.cart__item');
    searchItems.forEach((item) => item.addEventListener('click', cartItemClickListener));
  }
};

window.onload = function onload() {
  getEndPoint('computador');
  loadLocalStorage();
  sumTotalPrice();
};