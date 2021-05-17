const cartItems = '.cart__items';

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function loading() {
  const loadingElement = createCustomElement('div', 'loading', 'loading');
  document.querySelectorAll('.cart')[0].appendChild(loadingElement);
}

function loaded() {
  const loadingElement = document.querySelectorAll('.loading')[0];
  loadingElement.remove();
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

function fetchProducts() {
  return new Promise((resolve) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((json) => resolve(json.results));
  });
}

async function showTheProducts() {
  loading();
  await fetchProducts()
  .then((products) => {
    products.forEach((item) => {
      const itemFinded = { sku: item.id, name: item.title, image: item.thumbnail };
      document.getElementsByClassName('items')[0]
      .appendChild(createProductItemElement(itemFinded));
    });
  })
  .then(() => loaded());
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const totalPrice = '.total-price';
function cartItemClickListener(value) {
  const sign = value.target.innerText.split('$');
  const totalValue = document.querySelectorAll(totalPrice)[0];
  let transformInNumber = parseFloat(totalValue.innerText, 10);
  transformInNumber -= parseFloat(sign[1], 10);
  totalValue.innerText = (Math.round(transformInNumber * 100) / 100).toString();
  value.target.remove();
  const cartMenu = document.querySelectorAll(totalPrice)[0].innerHTML;
  localStorage.cartStatus = cartMenu;
  localStorage.totalPrice = document.querySelectorAll(totalPrice)[0].innerText;
}

// async function createCards() {
//   await fetchProducts()
//     .then((results) => {
//       results.forEach((item) => {
//         const itemToFind = { sku: item.id, name: item.title, image: item.thumbnail };
//         document.querySelectorAll('.items')[0].appendChild(createProductItemElement(itemToFind));
//       });
//     });
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getIdItems(item) {
  return new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/items/${item}`)
    .then((toJson) => toJson.json())
    .then((result) => resolve(result));
  });
}

async function addToShoppingCart(id) {
  await getIdItems(id)
  .then((item) => {
    const data = { sku: item.id, name: item.title, salePrice: item.price };
    const createAnElement = createCartItemElement(data);
    document.querySelectorAll(cartItems)[0].appendChild(createAnElement);
    return item;
  })
  .then((item) => {
    const totalValue = document.querySelectorAll(totalPrice)[0];
    let transformInNumber = parseFloat(totalValue.innerText, 10);
    const itemPrice = item.price;
    transformInNumber += itemPrice;
    totalValue.innerText = (Math.round(transformInNumber * 100) / 100).toString();
  });
}

function buttonToAdd() {
  const buttons = document.querySelectorAll('.item');
  buttons.forEach((values) => {
    values.addEventListener('click', async () => {
      await addToShoppingCart(values.firstChild.innerText);
      const saveCart = document.querySelectorAll(cartItems)[0].innerHTML;
      localStorage.cartStatus = saveCart;
      localStorage.fullPrice = document.querySelectorAll(totalPrice)[0].innerText;
    });
  });
}

function cleanAllCart() {
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((item) => {
    item.remove();
  });
  document.querySelectorAll(totalPrice)[0].innerText = '0';
  localStorage.cartStatus = document.querySelectorAll(totalPrice)[0].innerHTML;
  localStorage.fullPrice = '0';
}

window.onload = async () => {
  document.querySelectorAll(cartItems)[0]
  .innerHTML = localStorage.getItem('cartStatus');

  if (localStorage.getItem('fullPrice') !== null) {
    document.querySelectorAll(totalPrice)[0]
    .innerText = localStorage.getItem('fullPrice');
  }

  await showTheProducts();
  buttonToAdd();
  document.querySelectorAll('.cart__item')
  .forEach((value) => {
    value.addEventListener('click', cartItemClickListener);
  });

  document.querySelectorAll('.empty-cart')[0]
  .addEventListener('click', cleanAllCart);
 };
