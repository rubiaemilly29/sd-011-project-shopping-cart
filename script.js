async function fetchComputer() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const jsonResponse = await response.json();
  const result = await jsonResponse.results;
  return result;
}

async function fetchID(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const jsonResponse = await response.json();
  const result = await jsonResponse;
  return result;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCustomElement(element, className, innerText, event) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (event) {
    e.addEventListener('click', event);
  }
  return e;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function adItem(event) {
  const ev = getSkuFromProductItem(event.target.parentElement);
  const cartList = document.querySelector('.cart__items');
  fetchID(ev)
    .then(({ id, title, price }) => 
    createCartItemElement({ sku: id, name: title, salePrice: price }))
    .then((list) => cartList.appendChild(list))
    .catch((e) => console.log(e));
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', adItem));
  return section;
}

window.onload = async () => {
  const items = document.querySelector('.items');
  const list = await fetchComputer();
  list.forEach(({ id, title, thumbnail }) => {
    const listedItens = createProductItemElement({
      sku: id,
      name: title,
      image: thumbnail,
    });
    items.appendChild(listedItens);
  });
};
