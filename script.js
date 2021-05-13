const cartContainer = document.querySelector('.cart');
const cartItemsContainer = document.querySelector('.cart__items');
const totalPriceElement = document.querySelector('.total-price');

let loadingElement = null;

function toggleLoadingText(visible) {
  if (visible) {
    const newLoadingElement = document.createElement('h3');
    newLoadingElement.className = 'loading';
    newLoadingElement.innerText = 'loading...';
    cartContainer.appendChild(newLoadingElement);
    loadingElement = newLoadingElement;
  } else {
    loadingElement.remove();
  }
}

function getProductListing(queryTerm) {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${queryTerm}`;
  toggleLoadingText(true);

  return new Promise((resolve, reject) => {
    fetch(url)
    .then((response) => response.json())
    .then((json) => {
      toggleLoadingText(false);
      resolve(json.results);
    })
    .catch((e) => reject(e));
  });
}

function getProductDetails(productId) {
  const url = `https://api.mercadolibre.com/items/${productId}`;
  toggleLoadingText(true);

  return new Promise((resolve, reject) => {
    fetch(url)
    .then((response) => response.json())
    .then((json) => {
      toggleLoadingText(false);
      resolve(json);
    })
    .catch((e) => reject(e));
  });
}

function getStorage() {
  const savedStorage = localStorage.getItem('shoppingCart');
  const cartArray = savedStorage ? JSON.parse(savedStorage) : [];

  return cartArray;
}

function saveStorage(cartArray) {
  localStorage.setItem('shoppingCart', JSON.stringify(cartArray));
}

function addCartItemToLocalStorage(item) {
  const cartArray = getStorage();

  cartArray.push(item);

  saveStorage(cartArray);
}

function removeCartItemFromLocalStorage(id) {
  const cartArray = getStorage();

  const newArray = cartArray.filter((item) => item.sku !== id);

  saveStorage(newArray);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText, eventListener) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  if (eventListener) {
    e.addEventListener('click', eventListener);
  }
  return e;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function updateTotal(value) {
  let sum = parseFloat(totalPriceElement.innerText);

  sum += parseFloat(value);

  totalPriceElement.innerText = Math.round(sum * 100) / 100;
}

function cartItemClickListener(e) {
  removeCartItemFromLocalStorage(e.target.id);
  updateTotal(e.target.dataset.price * -1);
  e.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.dataset.price = salePrice;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItemToCart(cartElement) {
  cartItemsContainer.appendChild(cartElement);
  updateTotal(cartElement.dataset.price);
}

function handleAdd(e) {
  const productId = getSkuFromProductItem(e.target.parentElement);
  getProductDetails(productId)
  .then(({ id, title, price }) => {
    addCartItemToLocalStorage({ sku: id, name: title, salePrice: price });
    return createCartItemElement({ sku: id, name: title, salePrice: price });
  })
  .then((cartItemElement) => addItemToCart(cartItemElement))
  .catch((err) => console.error(err));
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', handleAdd);
  section.appendChild(addButton);

  return section;
}

function loadStorage() {
  const cartArray = getStorage();

  cartArray.forEach(({ sku, name, salePrice }) => {
    addItemToCart(createCartItemElement({ sku, name, salePrice }));
  });
}

function emptyCart() {
  while (cartItemsContainer.children.length) {
    cartItemsContainer.removeChild(cartItemsContainer.lastChild);
  }

  localStorage.removeItem('shoppingCart');
  totalPriceElement.innerText = '0';
}

window.onload = async function onload() {
  const itemsContainer = document.querySelector('.items');
  const itemList = await getProductListing('computador');
  itemList.forEach(({ id, title, thumbnail }) => {
    const itemElement = createProductItemElement({ sku: id, name: title, image: thumbnail });
    itemsContainer.appendChild(itemElement);
  });

  document.querySelector('.empty-cart').addEventListener('click', emptyCart);

  loadStorage();
};
