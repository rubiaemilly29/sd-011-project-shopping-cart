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

const soma = () => {
  const totalPrice = document.querySelector('.total-price');
  const li = [...document.querySelectorAll('.cart__item')];
  totalPrice.innerText = 0;
  const sumLi = li.reduce((acc, curr) => acc + Number(curr.innerText.split('PRICE: $')[1]), 0);
  totalPrice.innerText = sumLi;
  };

function cartItemClickListener(event) {
  event.target.remove();
  soma();
} 

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event));
  return li;
}

const getItem = () => {
  const elementoPai = document.querySelector('.cart__items');
  const botao = document.querySelectorAll('.item__add');
  botao.forEach((element) => element.addEventListener('click', () => {
    const id = element.parentElement.firstChild.innerText;
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((resposta) => resposta.json())
      .then((dados) => elementoPai.appendChild(createCartItemElement(dados)))
      .then(() => soma());
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

const limparCarrinho = () => {
  const botaoLimpar = document.querySelector('.empty-cart');
  botaoLimpar.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
  });
};

const load = async (computador) => {
  const api = await (await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computador}`));
  await api.json();
  document.querySelector('.loading').remove();
};

window.onload = function onload() { 
  load();
  listaDeProdutos();
  limparCarrinho();
};
