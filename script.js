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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveCartItems() {
  const cart1 = document.getElementsByClassName('cart__items')[0].innerHTML;
  localStorage.setItem('listItems', cart1);
}
function cartItemClickListener(event) { 
  if (event !== null && event.target !== null && event.target.parentNode !== null) {
  event.target.parentNode.removeChild(event.target);
  saveCartItems();
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createEvent(event) {
  const sku = event.target.parentElement.querySelector('.item__sku').innerText;
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then((response1) => response1.json())
  .then((response2) => {
    const listItem = createCartItemElement({ sku: response2.id, 
        name: response2.title, 
        salePrice: response2.price });
        const cartItem = document.querySelector(carItems);
        cartItem.appendChild(listItem);
        saveCartItems();
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
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((item) => {
    const listItens = document.querySelector('.items');
    item.results.forEach((element) => {
      const obj = { sku: element.id, name: element.title, image: element.thumbnail };
      listItens.appendChild(createProductItemElement(obj));
    });
  });
}

  function saveItems() {
  const savedItems = window.localStorage.getItem('listItems');
  document.querySelector('.cart__items').innerHTML = savedItems;
  let liItemSaved = document.getElementsByClassName('cart__items');
  liItemSaved = Array.from(liItemSaved);
  liItemSaved.forEach((element) => {
  element.addEventListener('click', cartItemClickListener);
  });
}

  function clearCart() {
    const button = document.querySelector('.empty-cart');
    button.addEventListener('click', () => {
    const ol = document.querySelector(carItems);
    ol.innerHTML = '';
    saveCartItems();
    });
  }

  window.onload = function onload() { 
promise();
saveItems();
clearCart();
  };
