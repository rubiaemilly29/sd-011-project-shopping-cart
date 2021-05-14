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

const carrin = '.cart__items';

const totalPriceOfProducts = () => {
  const cartItemsLength = document.querySelector(carrin).children.length;
  const totalPrice = document.querySelector('.total-price');
  const itemPrices = Object.values(localStorage);
  console.log(totalPrice);
  console.log(itemPrices);

  const splited = itemPrices.map((item) => item.split('$'));
  console.log(splited);

  const prices = splited.map((item) => parseFloat(item[1]));
  console.log(prices);

  if (cartItemsLength === 0) {
    totalPrice.innerText = 'Preço total:';
  }
  totalPrice.innerText = `${prices.reduce(((a, b) => a + b), 0)}`;
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  console.log(event.target.innerText);
  const storage = Object.entries(localStorage);
  storage.forEach((element) => {
    if (element[1] === event.target.innerText) {
      localStorage.removeItem(element[0]);
    }
  });
  event.target.remove();
  totalPriceOfProducts();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} 

async function fetchProducts() {
  const sectionItems = document.querySelector('.items');
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const API_FORMAT = { headers: { Accept: 'application/json' } };
  await fetch(API_URL, API_FORMAT)
  .then((response) => response.json())
  .then((data) => {
    console.log(data.results);
    data.results.forEach((item) => {
      const { id: sku, title: name, thumbnail: image } = item;
      const product = createProductItemElement({ sku, name, image });
      sectionItems.appendChild(product);
    });
  });
}

function addToCart() {
  const botao = document.querySelectorAll('.item__add');
  const carrinho = document.querySelector(carrin);
  botao.forEach((element) => element.addEventListener('click', async (event) => {
    const id = getSkuFromProductItem(event.target.parentNode);
    const cartEndpoint = `https://api.mercadolibre.com/items/${id}`;
    const format = { headers: { Accept: 'application/json' } };
    await fetch(cartEndpoint, format)
    .then((r) => r.json())
    .then((data) => {
      const { id: sku, title: name, price: salePrice } = data;
      const createItem = createCartItemElement({ sku, name, salePrice });
      carrinho.appendChild(createItem);
      localStorage.setItem(`${data.id}`, createItem.innerText);
    });
    totalPriceOfProducts();
  }));
}

const emptyCart = () => {
  const emptyButton = document.querySelector('.empty-cart');
  const preco = document.querySelector('.total-price');
  emptyButton.addEventListener('click', () => {
    const cartItems = document.querySelectorAll('.cart__item');
    cartItems.forEach((item) => item.remove());
    localStorage.clear();
    preco.innerText = 0;
  });
};

const checkStorage = () => {
  if (localStorage.length > 0) {
    const storage = Object.values(localStorage);
    console.log(storage);
    storage.forEach((item) => {
      console.log(item);
      const shopCar = document.querySelector(carrin);
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = item;
      li.addEventListener('click', cartItemClickListener);
      shopCar.appendChild(li);
    });
  }
};

window.onload = async function onload() {
  await fetchProducts();
  addToCart();
  emptyCart();
  checkStorage();
 };