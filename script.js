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

function saveLocalStorage() {
  const cartI = document.getElementsByClassName('cart__items')[0].innerHTML;
  localStorage.setItem('myList', cartI);
}

function cartItemClickListener(event) {
  if (event !== null && event.target !== null && event.target.parentNode !== null) {
    event.target.parentNode.removeChild(event.target);
    saveLocalStorage();
  }
 }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function additem(event) {
  const sku = event.target.parentElement.querySelector('.item__sku').innerText;
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json())
    .then((response2) => {
      const listItem = createCartItemElement(
        { sku: response2.id, name: response2.title, salePrice: response2.price },
      );
      const cart = document.querySelector('.cart__items');
      cart.appendChild(listItem);
      saveLocalStorage();
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonOn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonOn.addEventListener('click', additem);
  section.appendChild(buttonOn);

  return section;
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((responde) => responde.json())
    .then((item) => {
      const elementos = document.querySelector('.items');
      item.results.forEach((value) => {
        const objeto = { sku: value.id, name: value.title, image: value.thumbnail };
        elementos.appendChild(createProductItemElement(objeto));
      });
    });
  const saveItems = window.localStorage.getItem('myList');
  document.querySelector('.cart__items').innerHTML = saveItems;
  let liItem = document.getElementsByClassName('cart__items');
  liItem = Array.from(liItem);
  liItem.forEach((itens) => {
    itens.addEventListener('click', cartItemClickListener);
  });
};
