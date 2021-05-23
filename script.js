const ClassCart = '.cart__items';

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
.addEventListener('click', async (event) => {
  const btnAdd = event.target;
  const getSku = btnAdd.parentNode.firstChild.innerText;
  const returnResolve = await getApiSku(getSku);
  document.querySelector(ClassCart).appendChild(createCartItemElement(returnResolve));
  const cartItem = document.querySelector('.cart__items');
  localStorage.setItem('getSku', cartItem.innerHTML);
  });
return section; 
}
// Requisito 4
const loadStorage = () => {
const getSku = localStorage.getItem('getSku'); // pega tudo que tem dentro do localStorage
document.querySelector(ClassCart).innerHTML = getSku;
};
// requisito 6
const clearCart = () => {
  const emptyngCart = document.querySelector('.empty-cart');
  emptyngCart.addEventListener('click', () => {
    document.querySelector('ol.cart__items').innerHTML = '';
    localStorage.removeItem('getSku');
  });
};

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
  loadStorage();
  clearCart();
  }; 