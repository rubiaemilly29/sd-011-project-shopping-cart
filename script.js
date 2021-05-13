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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const getOl = document.querySelector('.cart__items');
  getOl.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
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
  .addEventListener('click', ({ target }) => {
    const getOl = document.querySelector('.cart__items');
    const getId = getSkuFromProductItem(target.parentNode);
    fetch(`https://api.mercadolibre.com/items/${getId}`)
      .then((response) => response.json())
      .then((json) => getOl.appendChild(createCartItemElement(json)));
    });
  return section;
}

const createFetch = async (term) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`)
    .then((response) => response.json())
    .then((obj) => obj.results.forEach(({ id, title, thumbnail }) => {
      const getSectionItems = document.querySelector('.items');
      const createProd = createProductItemElement({ sku: id, name: title, image: thumbnail });
      getSectionItems.appendChild(createProd);
  }));
};

window.onload = function onload() { 
  createFetch('computador');
};
