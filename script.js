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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const items = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  items.appendChild((section));
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener() {
//   // coloque seu código aqui.
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   // const ol = document.querySelector('.cart_items');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   // ol.appendChild(li);
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

function createProductList() {
    return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', 
    { method: 'GET', 'Content-Type': 'application/json' })
    .then((result) => result.json())
    .then((products) =>
    products.results.forEach((selectedProduct) => {
    createProductItemElement(selectedProduct);
    })); 
}

window.onload = function onload() {
  createProductList();
};
