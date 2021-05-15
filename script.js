const setLocalStorage = () => {
  const cartItems = document.querySelector('.cart__items');
  localStorage.setItem('Item: ', cartItems.innerHTML);
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const showSumPrice = () => {
  const showTotal = document.querySelector('.total-price');
  const cartItem = [...document.querySelectorAll('.cart__item')]
  .map((element) => element.innerHTML.match(/[\d.\d]+$/));
  showTotal.innerHTML = cartItem.reduce((acc, currVal) => acc + parseFloat(currVal), 0);
};

function cartItemClickListener(event) {
  event.target.remove();
  setLocalStorage();
  showSumPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemsCart = () => {
  const btnCart = document.querySelectorAll('.item__add');
  const getItems = document.querySelector('ol.cart__items');
  btnCart.forEach((items) => {
    items.addEventListener('click', () => {
      const sku = items.parentElement.firstChild.innerText;
      /* const count =  getItems.childElementCount; */
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then((result) => result.json())
        .then((data) => getItems.appendChild(createCartItemElement(data)));
      /* localStorage.setItem(`item ${count}`, sku); */
    });
  });
  setLocalStorage();
  showSumPrice();
};

const clearCart = () => {
  const btnEmpty = document.querySelector('.empty-cart');
  btnEmpty.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    document.querySelector('.total-price').innerHTML = 0;
    setLocalStorage();
  });
};

window.onload = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => data.results.forEach(({ id, title, thumbnail }) => {
      const selecItem = document.querySelector('.items');
      const listProduct = createProductItemElement({ sku: id, name: title, image: thumbnail });
      selecItem.appendChild(listProduct);
    }))
    .then(() => addItemsCart())
    .then(() => clearCart());
};
