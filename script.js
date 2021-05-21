//AQUI ESTÁ CRIANDO E RETORNANDO AS IMAGENS DOS PRODUTOS, E AS CLASSIFICANDO
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

//CRIANDO E RETORNANDO OS ELEMENTOS HTML, ADD AS CLASSES E O TEXTO
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
//Questão 1 - CRIANDO E RETORNANDO OS ITEMS DOS ELEMENTOS PRODUTOS
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const cartItemClickListener = async () => {
  // coloque seu código aqui
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const json = await response.json();
  const productItemApi = document.querySelector('.items');

  json.results.forEach((element) => {
    const elements = { 
      sku: element.id, 
      name: element.title, 
      image: element.thumbnail, 
    };
    const computerContainer = createProductItemElement(elements);
    productItemApi.appendChild(computerContainer);
  })
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() {
  cartItemClickListener();
};
