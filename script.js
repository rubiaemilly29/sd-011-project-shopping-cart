// Projeto contou com auxilio dos trybers da turma 11: Islene, Tales e Oryange
const getOl = '.cart__items';
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

const showSumPrice = () => {
  const totalPrice = document.querySelector('.total-price');
  const cartItem = [...document.querySelectorAll('.cart__item')];
  const getPrice = cartItem
    .reduce((acc, currVal) => acc + Number(currVal.innerText.split('$')[1]), 0);
  totalPrice.innerText = getPrice;
  /* console.log(totalPrice); */
};

function cartItemClickListener(event, count) {
  event.target.remove();
  localStorage.removeItem(`Item${count}`); // remove item - local storage
  showSumPrice();
}

function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  const cartItems = document.querySelector(getOl);
  const count = cartItems.childElementCount;
  localStorage.setItem(`Item${count}`, `${sku}|${name}|${price}`);
  /* console.log(localStorage); */
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, count));
  cartItems.appendChild(li);
  /* console.log(cartItems); */
  showSumPrice();
  return li;
}

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

const fetchProduct = () => {
  const selecItem = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => data.results.forEach(({ id, title, thumbnail, price }) => {
      const listProduct = createProductItemElement({ 
        sku: id, name: title, image: thumbnail, price });
      selecItem.appendChild(listProduct);
      /* console.log(selecItem); */
    }))
    .then(setTimeout(() => document.querySelector('.loading').remove(), 1000))
    .then(() => {
      for (let index = 0; index < localStorage.length; index += 1) {
        const [sku, name, price] = localStorage.getItem(`Item${index}`).split('|');
        createCartItemElement({ sku, name, price });
      }
    });
};

const clearCart = () => {
  const btnEmpty = document.querySelector('.empty-cart');
  btnEmpty.addEventListener('click', () => {
    const getClearCart = document.querySelector(getOl);
    const getClearPrice = document.querySelector('.total-price');
    getClearCart.innerHTML = '';
    getClearPrice.innerHTML = 0;
    localStorage.clear();
  });
};

window.onload = () => {
  fetchProduct();
  clearCart();
};
