const cartItemsOL = document.querySelector('.cart__items');

function saveLocalStorage() {
  const { innerHTML } = cartItemsOL;
  window.localStorage.setItem('sd-011-project-shopping-cart__cart_items', innerHTML);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(tagName, className, innerText) {
  const e = document.createElement(tagName);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function updateTotalPrice() {
  const elements = document.querySelectorAll('.cart__item');

  const totalPrice = Array.from(elements).reduce((acc, element) => {
    const price = Number(element.dataset.price);
    return acc + price;
  }, 0);

  document.querySelector('.total-price').innerText = totalPrice;
}

function onCartItemRemove(event) {
  event.target.remove();
  updateTotalPrice();
  saveLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');

  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.dataset.price = salePrice;

  li.addEventListener('click', onCartItemRemove);

  return li;
}

function showLoading() {
  document.body.appendChild(createCustomElement('span', 'loading', 'Carregando...'));
}

function hideLoading() {
  document.querySelector('.loading').remove();
}

function fetchWithLoading(url) {
  showLoading();

  return fetch(url)
    .then((response) => {
      hideLoading();
      return response.json(); 
    });
}

function addItemToCart(sku) {
  fetchWithLoading(`https://api.mercadolibre.com/items/${sku}`).then((product) => {
    const li = createCartItemElement({
      sku: product.id,
      name: product.title,
      salePrice: product.price,
    });

    cartItemsOL.appendChild(li);

    updateTotalPrice();
    saveLocalStorage();
  });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');

  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);

  button.addEventListener('click', () => {
    addItemToCart(sku);
  });

  return section;
}

function getInfoApi() {
  return fetchWithLoading('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
   .then((searchResult) => searchResult.results.map((product) => ({
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    })));
}

const itemListElement = document.querySelector('.items');

getInfoApi().then((productList) => {
  productList.forEach((product) => {
    const element = createProductItemElement(product);
    itemListElement.appendChild(element);
  });
});

const emptyCartButton = document.querySelector('.empty-cart');

emptyCartButton.addEventListener('click', () => {
  cartItemsOL.innerHTML = '';
  updateTotalPrice();
  saveLocalStorage();
});

const savedCartItemsHTML = window.localStorage.getItem('sd-011-project-shopping-cart__cart_items');

cartItemsOL.innerHTML = savedCartItemsHTML;

updateTotalPrice();

Array.from(cartItemsOL.children).forEach((li) => {
  li.addEventListener('click', onCartItemRemove);
});
