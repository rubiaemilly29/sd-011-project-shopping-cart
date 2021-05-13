const saveContent = (element) => {
  const content = element.innerHTML;
  localStorage.setItem(element.className, content);
};

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

function cartItemClickListener(event) {
  const { target } = event;
  if (target.className === 'cart__item') {
    target.parentElement.removeChild(target);
  }
  saveContent(document.querySelector('.cart__items'));
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSpecifItem(ItemID) {
  return new Promise((resolve, reject) => {
    const url = `https://api.mercadolibre.com/items/${ItemID}`;
    fetch(url)
      .then((data) => data.json())
      .then((result) => {
        const liProduct = createCartItemElement(result);
        const cart = document.querySelector('.cart__items');
        cart.appendChild(liProduct);
        saveContent(cart);
      });
  });
}

function addCartItem(event) {
  const { target } = event;
  if (target.tagName === 'BUTTON') {
    const product = target.parentElement;
    const id = product.querySelector('.item__sku').innerText;
    getSpecifItem(id);
  }
}

function getProductsList() {
  const QUERY = 'computador';
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;
  return new Promise((resolve, reject) => {    
    fetch(url)
      .then((data) => data.json())
      .then((result) => result.results.forEach((element) => {
        const items = document.querySelector('.items');
        items.appendChild(createProductItemElement(element));
      }));
  });
}

const loadContent = () => {
  const content = localStorage;
  Object.keys(content).forEach((curr) => {
    const element = document.querySelector(`.${curr}`);
    if (element) {
      element.innerHTML = localStorage[curr];
      console.log(element);
      element.querySelectorAll('li').forEach((son) => {
        son.addEventListener('click', cartItemClickListener);
      });
    }
  });
};

window.onload = function onload() { 
  getProductsList();
  loadContent();
  document.querySelector('.items').addEventListener('click', addCartItem);
};

// window.onclick = saveContent(document.querySelector('.cart__items'));
