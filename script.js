const cartItemsPrices = [];

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

const getProductList = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json())
    .then((response) => response.results.forEach((product) => {
      document.querySelector('.items')
        .appendChild(createProductItemElement({
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        }));
    }));
};

const removeIdStorange = (eventTarget) => {
  const id = eventTarget.innerText.slice(5, 18);

  localStorage.removeItem(id);
};

// Source: https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array
const removeItemArray = (arr, item) => {
  const index = arr.indexOf(item);
  if (index > -1) arr.splice(index, 1);
};

const sumPricesCartItems = (price) => {
  cartItemsPrices.push(price);

  const sumPrices = Math.round(cartItemsPrices.reduce((a, b) => a + b, 0) * 100) / 100;
  
  const liWithPrice = document.querySelector('.li-total-price');
  liWithPrice.textContent = `${sumPrices}`;
};

const olCart = document.querySelector('.cart__items');

function cartItemClickListener(event) {
  olCart.removeEventListener('click', cartItemClickListener);
  
  const isLi = event.target.nodeName === 'LI';
  if (!isLi) return;
  
  removeIdStorange(event.target);
  
  const textInLi = event.target.textContent;
  const price = textInLi.split('PRICE: $').pop();
  const itemPrice = parseFloat(price);
  
  removeItemArray(cartItemsPrices, itemPrice);
  sumPricesCartItems(0);
  removeItemArray(cartItemsPrices, 0);
  
  event.target.remove();
}

olCart.addEventListener('click', cartItemClickListener);

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const createTotalPriceOlCart = () => {
  const ol = document.createElement('ol');
  ol.className = 'total-price';
  const sectionCart = document.querySelector('.cart');

  sectionCart.appendChild(ol);

  const liTotalPrice = createCustomElement('li', 'li-total-price', 'PREÇO TOTAL:');

  ol.appendChild(liTotalPrice);
};

const addItemtoShoppingCart = (itemId) => {
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((response) => response.json())
  .then((json) => {
    const obj = {
      sku: json.id,
      name: json.title,
      salePrice: json.price,
    };
    olCart.appendChild(createCartItemElement(obj));
    sumPricesCartItems(json.price);
  });
};

const findClickAddItemCart = (event) => {
  const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) return;

  const parentSection = event.target.parentNode;
  const itemId = getSkuFromProductItem(parentSection);

  localStorage.setItem(itemId, itemId);

  addItemtoShoppingCart(itemId);
};

const items = document.querySelector('.items');
items.addEventListener('click', findClickAddItemCart);

const localStorageItemsCart = (idArr) => {
  idArr.forEach((id) => addItemtoShoppingCart(id));
};

window.onload = async () => {
  await getProductList('computador');
  await localStorageItemsCart(Object.keys(localStorage));
  await createTotalPriceOlCart();
};
