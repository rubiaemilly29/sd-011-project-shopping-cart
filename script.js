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

function cartItemClickListener(event, cartItems, count, salePrice) {
  // coloque seu código aqui
  cartItems.removeChild(event.target);
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = parseFloat(Number(totalPrice.innerText) - Number(salePrice));
  localStorage.removeItem(`Items${count}`);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(li);
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = parseFloat(Number(totalPrice.innerText) + Number(salePrice));

  localStorage.setItem(`Items${cartItems.childElementCount}`, `${sku}`);
  
  const count = cartItems.childElementCount;
  li.addEventListener('click', (e) => cartItemClickListener(e, cartItems, count, salePrice));
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const teste = (sku) => new Promise((accept) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((myFetch) => myFetch.json())
    .then((element) => accept(element));
});

const newTest = async (sku) => {
  try {
    const tt = await teste(sku);
    createCartItemElement(tt);
    return tt;
  } catch (error) {
    console.log('Error!!!');
  }
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', (event) => {
      console.log(event.path);
      const skuElement = getSkuFromProductItem(event.path[1]);
      newTest(skuElement);
    });
  const items = document.querySelector('.items');
  items.appendChild(section);

  return section;
}

const promiseProducts = () => new Promise((accept) => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((myFetch) => myFetch.json())
    .then((elements) => elements.results.map((element) => createProductItemElement(element)))
    .then(() => {
      for (let index = 1; index <= localStorage.length; index += 1) {
        const sku = localStorage.getItem(`Items${index}`).split(',');
        newTest(sku);
      }
      accept();
    });
});

const myPromise = async () => {
  try {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerText = 'Loading...';
    const items = document.querySelector('.items');
    items.appendChild(loading);
    await promiseProducts();
    await items.removeChild(loading);
  } catch (error) {
    console.log('ERROR!!');
  }
};

window.onload = function onload() {
  myPromise();
  const emptyCart = document.querySelector('.empty-cart');
  const totalPrice = document.createElement('span');
  const cart = document.querySelector('.cart');
  totalPrice.className = 'total-price';
  cart.appendChild(totalPrice);
  emptyCart.addEventListener('click', () => {
    const cartItems = document.querySelector('.cart__items');
    cartItems.innerHTML = '';
    totalPrice.innerText = '0';
    localStorage.clear();
  });
  totalPrice.innerText = '0';
};
