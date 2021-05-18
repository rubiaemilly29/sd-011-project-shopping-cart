const carItems = '.cart__items';

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

function fullPrice() {
  let items = document.getElementsByClassName('cart__item');
  items = Array.from(items);
  const prices = items.map((item) => parseFloat(item.dataset.price, 10));
  const finalPrice = prices.reduce((acc, curr) => acc + curr, 0);
  const actualPrice = document.querySelector('.total-price');
  actualPrice.innerText = finalPrice;
}

function savingProducts() {
  const cartSaving = document.getElementsByClassName('cart__items')[0].innerHTML;
  localStorage.setItem('listItems', cartSaving);
}
function cartItemClickListener(event) {
  if (event !== null && event.target !== null && event.target.parentNode !== null) {
  event.target.parentNode.removeChild(event.target);
  savingProducts();
  fullPrice();
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.dataset.price = salePrice;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createEvent(event) {
  const query = event.target.parentElement.querySelector('.item__sku').innerText;
  fetch(`https://api.mercadolibre.com/items/${query}`)
  .then((responseF) => responseF.json())
  .then((responseS) => {
    const listItem = createCartItemElement({ sku: responseS.id,
        name: responseS.title,
        salePrice: responseS.price });
        const cartItem = document.querySelector(carItems);
        cartItem.appendChild(listItem);
        savingProducts();
        fullPrice();
  });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonCart.addEventListener('click', createEvent);
  section.appendChild(buttonCart);

  return section;
}

function promise() {
  const listItens = document.querySelector('.items');
  const load = document.createElement('spam');
  listItens.appendChild(load);
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((item) => {
    listItens.innerText = '';
    item.results.forEach((element) => {
      const obj = { sku: element.id, name: element.title, image: element.thumbnail };
      listItens.appendChild(createProductItemElement(obj));
    });
  });
}

function saveStorage() {
  const saved = window.localStorage.getItem('listItems');
  document.querySelector('.cart__items').innerHTML = saved;
  let savedOnList = document.getElementsByClassName('cart__items');
  savedOnList = Array.from(savedOnList);
  savedOnList.forEach((element) => {
  element.addEventListener('click', cartItemClickListener);
  });
}
function clearCart() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
  const ol = document.querySelector(carItems);
  ol.innerHTML = '';
  savingProducts();
  fullPrice();
  });
}

window.onload = function onload() {
fullPrice();
promise();
saveStorage();
clearCart();
};
