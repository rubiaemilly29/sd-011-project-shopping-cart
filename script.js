function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

function verifiedFetch(url) {
  return new Promise((resolve, reject) => {
    if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
      return fetch(url)
        .then((result) => result.json())
        .then((json) => resolve(json.results.forEach((result) => {
          const itemAtributtes = {
            sku: result.id,
            name: result.title,
            image: result.thumbnail,
          };
          const newItem = createProductItemElement(itemAtributtes);
          const itemsSection = document.querySelector('.items');
          itemsSection.appendChild(newItem);
        })));
    }
    reject(new Error('endpoint não existe'));
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

async function newCartItem(sku) {
  const fetchParameter = {
    method: 'GET',
    'Content-Type': 'application/json',
  };
  return fetch(`https://api.mercadolibre.com/items/${sku}`, fetchParameter)
    .then((result) => result.json())
    .then((json) => {
      const itemAtributtes = {
        sku: json.id,
        name: json.title,
        salePrice: json.price,
      };
      const cartItem = createCartItemElement(itemAtributtes);
      const cartItens = document.querySelector('.cart__items');
      cartItens.appendChild(cartItem);
    });
}

function cartItemClickListener(event) {
  if (event.target.className === 'item__add') {
    const sku = event.target.parentNode.firstChild.innerText;
    newCartItem(sku);
  }
}

window.onload = function onload() {
  verifiedFetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const itemsSection = document.querySelector('.items');
  itemsSection.addEventListener('click', (event) => {
    cartItemClickListener(event);
  });
};
