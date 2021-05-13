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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // in progress
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function mercadoLivreAPI() {
  Promise((resolve, reject) => {
    const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
    const list = document.getElementsByClassName('items');
    const method = { method: 'GET', headers: { Accept: 'application/json' } };
    
    fetch(url, method)
      .then((response) => response.json())
      .then((json) => json.results
      .forEach((items) => list.appendChild(createProductItemElement(
        { sku: items.id, name: items.title, image: items.thumbnail },
      ))));

    resolve();
  });
}

window.onload = function onload() {
  mercadoLivreAPI();
};