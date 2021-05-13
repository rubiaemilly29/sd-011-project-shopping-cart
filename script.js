window.onload = function onload() {
  getProduct();
};

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

function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')).addEventListener('click', () => {
    createCartItemElement({ sku, name, price })
  })
  const itemSection = document.querySelector('.items')
  itemSection.appendChild(section)
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;

  const Items = document.querySelector('.cart__items')
  Items.appendChild(li).addEventListener('click', (event) => Items.removeChild(event.target))
  return li;
}

const getProduct = () => {
  return new Promise (() => {
    fetch("https://api.mercadolibre.com/sites/MLB/search?q=computador")
  .then(r => r.json())
  .then(r => r.results.forEach((computador) => createProductItemElement(computador)))
  })
}