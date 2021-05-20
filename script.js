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
  // coloque seu código aqui!
}

function createCartItemElement({ id: sku, title: name, salePrice: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCarItem = (id) => {
  const param = { headers: { Accept: 'application/json' } };
  fetch('https://api.mercadolibre.com/items/${id}', param)
    .then((response) => response.json())
    .then((json) => {
      const selectCarItem = document.querySelector('.cart__items')
      selectCarItem.appendChild(createCartItemElement);
    }); 
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const createButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  createButton.addEventListener('click', ({event}) => {
    addCarItem.appendChild(getSkuFromProductItem(event.parentElement));
  })

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

window.onload = function onload() {
  const param = { headers: { Accept: 'application/json' } };
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador', param)
    .then((response) => response.json())
    .then((json) => {
      const objSection = document.querySelector('.items');
      json.results.forEach((value) => {
        objSection.appendChild(createProductItemElement(value));
      });
    }); 
};