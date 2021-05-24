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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  return li;
}

function createProductItemElement({ sku, name, image, salePrice }) {
  const items = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => createCartItemElement({ sku, name, salePrice }));
  items.appendChild(section);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function simplifyProduct(computers) {
  return {
    sku: computers.id,
    name: computers.title,
    image: computers.thumbnail,
    salePrice: computers.price,
  };
}

const searchProductsOnApi = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((json) => json.results)
    .then((computers) => computers.map((computer) => simplifyProduct(computer)))
    .then((elements) => elements.forEach((element) => createProductItemElement(element)))
    .catch((e) => alert('Ops! Algo deu errado!'));
};

function emptyCart() {
  const emptyBtn = document.querySelector('.empty-cart');
  emptyBtn.addEventListener('click', () => {
    const carItems = document.querySelector('.cart__items');
    carItems.innerHTML = '';
  });
}

window.onload = function onload() { 
  searchProductsOnApi();
  emptyCart();
};
