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

function cartItemClickListener(event) {
  // console.log(event.target);
  const liSaver = event.target;
  const text = liSaver.innerText;
  liSaver.remove();
  const storageArray = JSON.parse(localStorage.getItem('item'));
  const storageIndex = storageArray.indexOf(text);
  storageArray.splice(storageIndex, 1);
  localStorage.setItem('item', JSON.stringify(storageArray));
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  const storageArray = JSON.parse(localStorage.getItem('item')) || [];
  storageArray.push(`SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`);
  localStorage.setItem('item', JSON.stringify(storageArray));
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const fetchApiCartItem = (id) => {
  const API_URL = `https://api.mercadolibre.com/items/${id}`;
  const headers = { headers: { Accept: 'application/json' } };

  fetch(API_URL, headers)
    .then((response) => response.json())
    .then((json) => {
      const cartList = document.querySelector('.cart__items');
      cartList.appendChild(createCartItemElement(json));
    });
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', ({ target }) => {
    fetchApiCartItem(getSkuFromProductItem(target.parentElement));
  });
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);
  
  return section;
}

const fetchApi = () => {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const headers = { headers: { Accept: 'application/json' } };
  
  fetch(API_URL, headers)
    .then((response) => response.json())
    .then((json) => {
      // console.log(json.results);
      const jsonResultsArray = json.results;
      const mainSection = document.querySelector('.items');
      jsonResultsArray.forEach((computer) => {
        mainSection.appendChild(createProductItemElement(computer));
      });
    });
};

const getItemFunction = () => {
  const cartOl = document.querySelector('.cart__items');
  const storageArray = JSON.parse(localStorage.getItem('item'));
  if (storageArray) {
    storageArray.forEach((computer) => {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = computer;
      cartOl.appendChild(li);
    });
  }
};

// const generateTotalPrice = () => {
//   const promise = new Promise((resolve, reject) => {

//   });
// };

const removeOnClick = () => {
  const emptyBttn = document.querySelector('.empty-cart');
  emptyBttn.addEventListener('click', () => {
    const cartOl = document.querySelector('.cart__items');
    cartOl.innerHTML = '';
  });
};

window.onload = function onload() {
  fetchApi();
  getItemFunction();
  // generateTotalPrice();
  removeOnClick();
};
