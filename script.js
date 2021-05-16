const thecart = document.querySelector('.cart__items');

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

function updateTotalPrice() {

}

function localStorageItems() {
  const textitem = thecart.innerHTML;
  localStorage.setItem('cart', textitem);
}

function cartItemClickListener(event) {
  const local = event.target;
  thecart.removeChild(local);
  localStorageItems();
  updateTotalPrice();
}

function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', (event) => cartItemClickListener(event));
  const cartList = thecart;
  cartList.appendChild(li);
  localStorageItems();
  return li;
}

const removeCartItems = () => {
  const cartItem = '.cart__items';
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector(cartItem).innerHTML = '';
  });
  localStorage.removeItem('cart');
};

function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => createCartItemElement({ sku, name, price }));
 
  return section;
}

const productsList = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=pc_gamer')
    .then((r) => r.json())
    .then((data) => {
     data.results.forEach((product) => {
        const object = {
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
          price: product.price,
        };
        document.querySelector('.items').appendChild(createProductItemElement(object));
      });
      document.querySelector('.loading').remove();
    });
};

function loadLocalStorage() {
  const theLocalStorage = localStorage.getItem('cart');
  thecart.innerHTML = theLocalStorage;
}

window.onload = async () => {
  productsList();
  loadLocalStorage();
  removeCartItems();
};
