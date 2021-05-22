const cart = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const saveCartToPage = () => localStorage.setItem('saveShoppingCart', cart.innerHTML);

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const cartItemClickListener = (event, salePrice) => { 
  event.target.remove();
  totalPrice.innerText = parseFloat(Number(totalPrice.innerText) - salePrice);
  saveCartToPage();
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, salePrice));
  totalPrice.innerText = parseFloat(Number(totalPrice.innerText) + salePrice);
  return li;
}

const addToCart = (event) => {
  const itemID = event.target.parentNode.querySelector('.item__sku').innerText;
  console.log(itemID);
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
  .then((response) => response.json())
  .then((data) => cart.appendChild(createCartItemElement(data)))
  .then(() => saveCartToPage()); 
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', addToCart);
  section.appendChild(button);
  return section;
}

const pageLoading = () => {
  const loading = document.querySelector('.loading');
  loading.innerText = 'loading page...';
};

const pageLoaded = () => {
  const loading = document.querySelector('.loading');
  loading.remove();
};

function fecthProduts() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')  
  .then((response) => response.json())
  .then((data) =>
  data.results.forEach((element) => {
    const htmlElement = createProductItemElement({
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    });
    document.querySelector('.items').appendChild(htmlElement);
  }))
  .then(() => setTimeout(() => pageLoaded(), 700));
  pageLoading();
}

function clearCart() {
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', () => {
    cart.innerHTML = '';
  });
}

const loadFromStorage = () => {
  const save = localStorage.getItem('saveShoppingCart');
  cart.innerHTML = save;
};

window.onload = function onload() {
  fecthProduts();
  clearCart();
  loadFromStorage();
};