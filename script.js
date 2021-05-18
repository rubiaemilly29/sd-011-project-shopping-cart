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

function cartItemClickListener(event) {
  event.target.remove();
}

const cartApi = async (sku) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const data = await response.json();
  return data;
};

const cartLocalStorage = () => {
  const cartSave = document.querySelector('ol.cart__items').innerHTML;  
  localStorage.setItem('reloadCart', cartSave);  
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = async (e) => {
  const addItem = document.querySelector('.cart__items');
  const sku = await getSkuFromProductItem(e.target.parentElement); 
  const item = await cartApi(sku);
  addItem.appendChild(createCartItemElement(item));
  cartLocalStorage();
};

const returnCartLocalStorate = () => {
  const cartSave = document.querySelector('.cart__items');
  const cartReturn = localStorage.getItem('reloadCart');
  cartSave.innerHTML = cartReturn;
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
      .addEventListener('click', addToCart);

  return section;
}

const removeCartItens = () => {
  const btn = document.querySelector('button.empty-cart');  
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cart__item').forEach((item) => item.remove());
    localStorage.clear();
  });
  return btn;
};

const apiFetch = () => {
  const mainSection = document.querySelector('section');
  const sectionLoading = createCustomElement('span', 'loading', 'loading!');
  mainSection.appendChild(sectionLoading);
  setTimeout(() => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then(document.querySelector('.loading').remove())
    .then((response) => response.json())
    .then((response) => response.results.forEach((item) => {
      const sect = document.querySelector('.items');
      sect.appendChild(createProductItemElement(item));
    }));
  }, 3000);  
};

window.onload = function onload() { apiFetch(); returnCartLocalStorate(); removeCartItens(); };