const getPrices = [];
const classCart = '.cart__items';

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

const cartItemClickListener = ({ target }) => {
  const obj = target.parentNode.children;
  const getPriceHtml = document.querySelector('.total-price');
  
  const objRest = [...obj];
  objRest.forEach((itemList, index) => {
    if (target === itemList) {
      target.parentNode.removeChild(target);
      getPrices.splice(index, 1);
      const soma = getPrices.reduce((acc, currValue) => acc + currValue, 0);
      getPriceHtml.textContent = soma;
    }
  });
  
  return target;
};

const addItemCart = async (item) => {
  const product = await fetch(`https://api.mercadolibre.com/items/${item}`);
  const responseData = await product.json();
  return responseData;
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__items';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', async () => {
    const son = section.firstChild.textContent;
    const data = await addItemCart(son);
    document.querySelector(classCart).appendChild(createCartItemElement(data));
    getPrices.push(data.price);
    const getPriceHtml = document.querySelector('.total-price');
    const soma = getPrices.reduce((acc, currValue = 0) => acc + currValue);
    getPriceHtml.textContent = soma;
  });
  
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const clearCart = () => {
  const getButtonClear = document.querySelector('.empty-cart');
  
  getButtonClear.addEventListener('click', () => {
    document.querySelector('ol.cart__items').innerHTML = '';
    document.querySelector('span.total-price').innerHTML = '$0,00';
  });
};

function fetchApiAndAddList() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((json) => json.results.forEach(({ id, title, thumbnail }) => {
    const elementsApi = createProductItemElement({ sku: id, name: title, image: thumbnail });
    const getSection = document.querySelector('.items');
     getSection.appendChild(elementsApi);
  }));
}
window.onload = function onload() {
  fetchApiAndAddList();
  clearCart();
};