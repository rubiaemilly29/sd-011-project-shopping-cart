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

function cartItemClickListener(event) {
  // x
 }

function createCartItemElement({ sku, name, price }) {
  const getClass = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  getClass.appendChild(li);
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const getItens = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => createCartItemElement({ sku, name, price }));
  getItens.appendChild(section);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function getKartItens(event) {
  const consultLink = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const json = await consultLink.json();
  const { results } = await json;
  
  results.forEach((element) => createProductItemElement(element));
}

window.onload = function onload() {
getKartItens();
};
