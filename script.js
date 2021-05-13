const fetchById = (ItemID) => fetch(`https://api.mercadolibre.com/items/${ItemID}`)
  .then((r) => r.json())
  .then((r) => r);

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.parentNode.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const btnAddCartEvent = async (event) => {
  const id = getSkuFromProductItem(event.target.parentElement);
  const item = await fetchById(id);
  const li = createCartItemElement({ sku: item.id, name: item.title, salePrice: item.price });
  const cart = document.querySelector('ol.cart__items');
  cart.appendChild(li);
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAddCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(btnAddCart);
  btnAddCart.addEventListener('click', btnAddCartEvent);

  return section;
}

const fetchProducts = (QUERY) => fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`)
    .then((r) => r.json())
    .then((r) => r.results);

const createList = async () => {
  const productsArr = await fetchProducts('computador');
  productsArr.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const htmlItems = createProductItemElement({ sku, name, image });
    const section = document.querySelector('section.items');
    section.appendChild(htmlItems);
  });
};

window.onload = function onload() {
  createList();
};
