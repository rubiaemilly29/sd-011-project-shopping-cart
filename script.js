const fetchApi = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const headers = { headers: { Accept: 'application/json' } };

  fetch(url, headers)
    .then((response) => response.json())
    .then((json) => {
      const jsonResults = json.results;
      const html = document.querySelector('.items');
      jsonResults.forEach(({ id, title, thumbnail, price }) => {
        html.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail, salePrice: price}));
      });
  });
};

// adiciona o produto ao carrinho 
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  const cartOL = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: ${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  cartOL.appendChild(li);
  return li;
}

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

function createProductItemElement({ sku, name, image, salePrice }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => createCartItemElement({ sku, name, salePrice }));
  
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const eventTg = event.target;
  eventTg.remove();
}



//


window.onload = function onload() {
  fetchApi();
};