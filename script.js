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

function cartItemClickListener() {
  // coloque seu código aqui
  
}

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
  });
  
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

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
};