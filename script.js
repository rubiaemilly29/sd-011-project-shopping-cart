// const loading = () => {
//   const divLoading = document.querySelector('.foot-price');
//   const elementLoading = document.createElement('div');
//   elementLoading.className = 'loading';
//   elementLoading.innerText = 'loading...';
//   divLoading.appendChild(elementLoading);
// };

const clearLoading = () => {
  const elementLoading = document.querySelector('.loading');
  elementLoading.remove();
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const sumPricesCart = () => {
  const arrayCart = document.querySelectorAll('.cart__item');
  let sumPricesItems = 0;
  arrayCart.forEach((itemCart) => {
    const textItemCart = itemCart.innerText;
    const textItemCartSplit = textItemCart.split('$');
    const valueItemCart = parseFloat(textItemCartSplit[1]);
    sumPricesItems += valueItemCart;
  });
  console.log(sumPricesItems);
  const totalCartItems = document.querySelector('#sum-price');
  totalCartItems.innerText = `${sumPricesItems}`;
};

function cartItemClickListener(event) {
  const removeItem = event.target;
  localStorage.removeItem(removeItem.innerText);
  removeItem.remove();
  sumPricesCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getItemForCart = (itemID) => {
  const myObjects = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  fetch(`https://api.mercadolibre.com/items/${itemID}`, myObjects)
  .then((response) => response.json())
  .then((json) => {
    const item = createCartItemElement({ sku: json.id, name: json.title, salePrice: json.price });
    document.querySelector('.cart__items').appendChild(item);
    localStorage.setItem(item.innerText, item.innerText);
    sumPricesCart();
  })
  .catch(() => 'erro no API');
};

const addButtonItem = () => {
  const buttonItem = document.querySelector('.items');
  buttonItem.addEventListener('click', (event) => {
    const idItem = event.path[1].children[0].innerText;
    getItemForCart(idItem);
  });
};

const getItens = () => {
  const myObjects = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', myObjects)
  .then((response) => response.json())
  .then((json) => json.results.forEach((item) => {
    const i = createProductItemElement({ sku: item.id, name: item.title, image: item.thumbnail });
    document.querySelector('.items').appendChild(i);
  }))
  .catch(() => 'erro no API');
  setTimeout(() => clearLoading(), 3000);
};

const recoveryCartLocalStorage = () => {
  const local = Object.entries(localStorage);
  local.forEach((itemCart) => {
    const li = document.createElement('li');
    const liText = itemCart[1];
    li.className = 'cart__item';
    li.innerText = liText;
    li.addEventListener('click', cartItemClickListener);
    document.querySelector('.cart__items').appendChild(li);
  });
  sumPricesCart();
};

const deletAllItensCart = () => {
  const itemsCart = document.querySelectorAll('.cart__item');
  itemsCart.forEach((item) => {
    localStorage.removeItem(item.innerText);
    item.remove();
    sumPricesCart();
  });
};

const clearCart = () => {
  const btnClearCart = document.querySelector('.empty-cart');
  btnClearCart.addEventListener('click', deletAllItensCart);
};

window.onload = function onload() { 
  getItens();
  addButtonItem();
  recoveryCartLocalStorage();
  clearCart();
};
