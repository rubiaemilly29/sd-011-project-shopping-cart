const toOl = '.cart__items';

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const totalPrice = async () => {
  let pricesOfProducts = 0;
  const getPrice = document.querySelectorAll('li');
  getPrice.forEach((li) => {
    const valor = li.innerText.split('$');
    pricesOfProducts += Number(valor[1]);
  });
  const spanPrice = document.querySelector('.total-price');
  spanPrice.innerText = `${pricesOfProducts}`;
};

function cartItemClickListener(event) {
  const getOl = document.querySelector(toOl);
  getOl.removeChild(event.target);
  totalPrice();
}

const saveInLocalStorage = () => {
  const getCart = document.querySelector(toOl);
  localStorage.setItem('saveProducts', getCart.innerHTML);
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', ({ target }) => {
    const getOl = document.querySelector(toOl);
    const getId = getSkuFromProductItem(target.parentNode);
    fetch(`https://api.mercadolibre.com/items/${getId}`)
      .then((response) => response.json())
      .then((json) => getOl.appendChild(createCartItemElement(json)))
      .then(() => saveInLocalStorage())
      .then(() => totalPrice());
    });
  return section;
}

const loadingSpin = () => {
  const getLoad = document.querySelector('.loading');
  getLoad.classList.add('display');
};

const hiddenLoad = () => {
  const getLoad = document.querySelector('.loading');
  getLoad.classList.remove('display');
  getLoad.remove();
};

const createFetch = async (term) => {
  loadingSpin();
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`)
    .then((response) => response.json())
    .then((obj) => { 
      hiddenLoad();
      obj.results.forEach(({ id, title, thumbnail }) => {
      const getSectionItems = document.querySelector('.items');
      const createProd = createProductItemElement({ sku: id, name: title, image: thumbnail });
      getSectionItems.appendChild(createProd);
      });
    });
};

const clearCart = () => {
  const getClearBtn = document.querySelector('.empty-cart');
  getClearBtn.addEventListener('click', () => {
    document.querySelector(toOl).innerHTML = '';
    totalPrice();
    localStorage.clear();
  });
};

window.onload = function onload() { 
  createFetch('computador');
  document.querySelector(toOl).innerHTML = localStorage.getItem('saveProducts');
  clearCart();
  totalPrice();
};
