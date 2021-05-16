const cartItemsOl = '.cart__items';

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

function saveCartOnStorage() {
  const cartList = document.querySelector(cartItemsOl).innerHTML;
  localStorage.setItem('savedCart', cartList);  
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getItemByID(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const itemData = await response.json();
  return itemData;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function addItemToCart(event) {
  const cartList = document.querySelector(cartItemsOl);
  const id = await getSkuFromProductItem(event.target.parentElement);
  const item = await getItemByID(id);
  cartList.appendChild(createCartItemElement(item))
  .addEventListener('click', cartItemClickListener);
  saveCartOnStorage();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addItemToCart);
  return section;
}

function render() {
  const itemSection = document.querySelector('section .items');

  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((json) => {
      json.results.forEach((product) => {
        const item = createProductItemElement({
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        });
        itemSection.appendChild(item);
      });
    });
}

function loadStorageCartToHTML() {
  const storageCart = localStorage.getItem('savedCart');
  const cartList = document.querySelector(cartItemsOl);
  cartList.innerHTML = storageCart;
  cartList.addEventListener('click', cartItemClickListener);
}

function clearCart() {
  localStorage.clear();
  loadStorageCartToHTML();
}

const clearCartButton = document.querySelector('.empty-cart');
clearCartButton.addEventListener('click', clearCart);

window.onload = function onload() { 
 render();
 loadStorageCartToHTML();
}; 
