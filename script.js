const totalPrice = document.querySelector('.total-price');

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

function cartItemClickListener(event, createLi, count, price) {
  // Tales me ajudou.
  localStorage.removeItem(`produce${count}`);
  createLi.removeChild(event.target);
  totalPrice.innerText = parseFloat(Number(totalPrice.innerText) - Number(price));
}

function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  const createLi = document.querySelector('.cart__items');
  localStorage.setItem(`produce${createLi.childElementCount}`, `${sku},${name},${price}`);
  const count = createLi.childElementCount;
  createLi.appendChild(li)
  .addEventListener('click', (event) => cartItemClickListener(event, createLi, count, price));
  totalPrice.innerText = parseFloat(Number(totalPrice.innerText) + Number(price));
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const section = document.createElement('section');
  const sectionItens = document.querySelector('.items');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 
  'Adicionar ao carrinho!')).addEventListener('click',
  () => createCartItemElement({ sku, name, price }));
  sectionItens.appendChild(section);
  return section;
}

const getProduce = async (QUERY) => {
  const loading = document.querySelector('.loading');
  const cart = document.querySelector('.cart');
  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`)
    .then((response) => response.json())
    .then((response) => response.results.forEach((computer) => createProductItemElement(computer)))
    .then(() => {
      cart.removeChild(loading);
      // tales me ajudou nessa.
      for (let index = 0; index < localStorage.length; index += 1) {
       const [sku, name, price] = localStorage.getItem(`produce${index}`).split(',');
       const valueLocal = { sku, name, price };
       createCartItemElement(valueLocal);
      }
    });
};
const setProduce = () => getProduce('computador');

window.onload = function onload() {
  setProduce();
  // o Tales da turma 11 me ajudou nessa questão.
  const button = document.getElementsByClassName('empty-cart')[0];
  button.addEventListener('click', () => {
    const cartItems = document.querySelector('.cart__items');
    cartItems.innerHTML = '';
    totalPrice.innerText = '0';
    localStorage.clear();
  });
};
