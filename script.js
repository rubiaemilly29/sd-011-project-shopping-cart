const cartItems = '.cart__items';

// remove o item do carrinho
function cartItemClickListener(price, event) {
  const eventTg = event.target;
  const cartOL = document.querySelector('.cart__items');
  const spanTotal = document.querySelector('.total-price');
  spanTotal.innerHTML = parseFloat(Number(spanTotal.innerHTML) - Number(price)); // faz a subtração
  eventTg.remove();
  localStorage.setItem('keyName', cartOL.innerHTML);
}

function sumCart(price) {
  const spanTotal = document.querySelector('.total-price');
  spanTotal.innerHTML = parseFloat(Number(spanTotal.innerHTML) + Number(price)); // faz a soma
}

// adiciona o produto ao carrinho 
function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  const cartOL = document.querySelector(cartItems);
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', (event) => cartItemClickListener(price, event));

  cartOL.appendChild(li);
  localStorage.setItem('keyName', cartOL.innerHTML);
  sumCart(price);
  return li;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// configura o elemento
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// exibe os computadores
function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  const html = document.querySelector('.items');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => createCartItemElement({ sku, name, price }));
  
  html.appendChild(section);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

//

const fetchApi = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const headers = { headers: { Accept: 'application/json' } };

  fetch(url, headers)
    .then((response) => response.json())
    .then((json) => {
      const jsonResults = json.results;
      jsonResults.forEach(({ id, title, thumbnail, price }) => {
        createProductItemElement({ sku: id, name: title, image: thumbnail, price });
      });
  });
};

function getItem() {
  const local = localStorage.getItem('keyName');
  const cartOL = document.querySelector(cartItems);
    cartOL.innerHTML = local;
  const cartLi = document.querySelectorAll('.cart__item');
  cartLi.forEach((elements) => elements.addEventListener('click', cartItemClickListener));
}

window.onload = function onload() {
  fetchApi();
  getItem();
};