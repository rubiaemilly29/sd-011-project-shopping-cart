// const { result } = require("cypress/types/lodash");

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getItem = () => {
  const elementoPai = document.querySelector('.cart__items');
  const botao = document.querySelectorAll('.item__add');
  botao.forEach((element) => element.addEventListener('click', () => {
    const id = element.parentElement.firstChild.innerText;
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((resposta) => resposta.json())
      .then((dados) => elementoPai.appendChild(createCartItemElement(dados)));
  }));
};

const listaDeProdutos = () => {  
  const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
    fetch(api, myObject)
      .then((resposta) => resposta.json())
      .then((data) => data.results
      .forEach(({ id, title, thumbnail }) => {
        const section = document.querySelector('.items');
        const objList = createProductItemElement({ sku: id, name: title, image: thumbnail });
        section.appendChild(objList);
      })).then(() => getItem());
};
window.onload = function onload() { 
  listaDeProdutos();
};
