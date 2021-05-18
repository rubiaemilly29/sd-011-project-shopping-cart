const lintTeAmo = '.cart__items';
const totalPrice = document.querySelector('.total-price');
const button = document.querySelector('.empty-cart');

const removeButton = () => {
  button.addEventListener('click', () => {
    const liCartItem = document.querySelectorAll('li');
    liCartItem.forEach((li) => li.remove());
    totalPrice.innerHTML = '00.00';
    localStorage.clear();
  });
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

function cartItemClickListener(event) {
  const cartItems = document.querySelector(lintTeAmo);
  cartItems.removeChild(event.target);
  localStorage.setItem('carrinho', cartItems.innerHTML);
}

function createCartItemElement({ sku, name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  const cartItems = document.querySelector(lintTeAmo);
  cartItems.appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  cartItems.appendChild(li).addEventListener('click', () => {
    totalPrice.innerText = (parseFloat(Number(totalPrice.innerText) - salePrice));
  });
  totalPrice.innerText = (parseFloat(Number(totalPrice.innerText) + salePrice));
  localStorage.setItem('carrinho', cartItems.innerHTML);
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const itens = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => {
    createCartItemElement({ sku, name, price });
    localStorage.setItem('carrinho', document.querySelector(lintTeAmo).innerHTML);
  });
  itens.appendChild(section);
  return section;
}

async function showItens() {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => data.results.forEach((result) => {
      const productItem = createProductItemElement(result);
      const items = document.querySelector('.items');
      items.appendChild(productItem);
    }))
    .catch((error) => console.log(`:( Error ${error}`));
    document.querySelector('.loading').remove();
}

const verificaLocalStorage = () => {
  if (localStorage.carrinho) {
    document.querySelector('.cart__items').innerHTML = localStorage.getItem('carrinho');
    const cartItem = document.querySelectorAll(lintTeAmo);
    cartItem.forEach((element) => {
      element.addEventListener('click', cartItemClickListener);
    });
  }
};

window.onload = function onload() { 
  showItens();
  verificaLocalStorage();
  removeButton();
};
