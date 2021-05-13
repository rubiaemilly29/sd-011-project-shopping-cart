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
function cartItemClickListener(event, createLi, count) {
  localStorage.removeItem(`produce${count}`);
  createLi.removeChild(event.target);
}

function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  const createLi = document.querySelector('.cart__items');
  localStorage.setItem(`produce${createLi.childElementCount}`, `${sku},${name},${price}`);
  const count = createLi.childElementCount;
  createLi.appendChild(li)
  .addEventListener('click', (event) => cartItemClickListener(event, createLi, count));
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 
  'Adicionar ao carrinho!')).addEventListener('click',
   () => createCartItemElement({ sku, name, price }));
  const sectionItens = document.querySelector('.items');
  sectionItens.appendChild(section);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const getProduce = (QUERY) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`)
    .then((response) => response.json())
    .then((response) => response.results.forEach((computer) => createProductItemElement(computer)))
    .then(() => {
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
};
