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

const showSumPrice = () => {
  const totalPrice = document.querySelector('.total-price');
  const cartItem = [...document.querySelectorAll('.cart__item')];
  const getPrice = cartItem
    .reduce((acc, currVal) => acc + Number(currVal.innerText.split('$')[1]), 0);
  totalPrice.innerText = getPrice;
  console.log(totalPrice);
};

function cartItemClickListener(event, count) {
  event.target.remove();
  localStorage.removeItem(`Item${count}`);
  showSumPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  const cartItems = document.querySelector(getOl);
  const count = cartItems.childElementCount;
  localStorage.setItem(`Item${count}`, `${sku}|${name}|${salePrice}`);
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (e) => cartItemClickListener(e, count));
  cartItems.appendChild(li);
  showSumPrice();
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const addItemsTocart = (e) => {
  const cartItems = document.querySelector(getOl);
  if (e.target.className === 'item__add') {
    const id = getSkuFromProductItem(e.target.parentElement);
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json())
      .then((data) => {
        cartItems.appendChild(createCartItemElement(data));
      });
  }
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  /* section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')); */
  const btnAddItem = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAddItem.addEventListener('click', addItemsTocart);
  section.appendChild(btnAddItem);

  return section;
}

const keepStorageCart = () => {
  const cartItems = document.querySelector(getOl);
  if (localStorage.length !== []) {
    for (let index = 0; index < localStorage.length; index += 1) {
      const [id, title, price] = localStorage.getItem(`Item${index}`).split('|');
      const getItems = { id, title, price };
      cartItems.appendChild(createCartItemElement(getItems));
    }
  }
};

const fecthProduct = () => {
  const selecItem = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((result) => {
        selecItem.appendChild(createProductItemElement({
          sku: result.id,
          name: result.title,
          image: result.thumbnail,
        }));
      });
    })
    .then(setTimeout(() => document.querySelector('.loading').remove(), 1000))
    .then(() => keepStorageCart());
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
  fecthProduct();
  clearCart();
};
