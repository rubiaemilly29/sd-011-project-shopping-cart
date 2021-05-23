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

const getApiSku = async (id) => {
  const request = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const resolve = await request.json();
  return resolve;
  };

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const { target } = event;
  const childens = target.parentNode.children;
  const rest = [...childens]; // transformando HTMLCollection em array.
  rest.forEach((item) => {
    if (target === item) {
      target.parentNode.removeChild(target);
    }
  });
 }

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cartItem';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
section.className = 'item';

section.appendChild(createCustomElement('span', 'item__sku', sku));
section.appendChild(createCustomElement('span', 'item__title', name));
section.appendChild(createProductImageElement(image));
section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
// requisito 2
.addEventListener('click', async (event) => {
  const btnAdd = event.target;
  const getSku = btnAdd.parentNode.firstChild.innerText;
  const returnResolve = await getApiSku(getSku);
  const saveOl = document.querySelector('.cart__items');
  saveOl.appendChild(createCartItemElement(returnResolve));
  });
return section; 
}

// requisito 1
const getApi = async () => {
const request = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
const resolve = await request.json();
    const resolved = await resolve.results;
    resolved.forEach((item) => {
      const returnValue = createProductItemElement(item);
      const raiseChild = document.querySelector('.items');
      raiseChild.appendChild(returnValue);
    });
  };

  window.onload = function onload() {
  getApi();
  console.log();
}; 