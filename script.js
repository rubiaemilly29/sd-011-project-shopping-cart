const fetchById = (ItemID) => fetch(`https://api.mercadolibre.com/items/${ItemID}`)
  .then((r) => r.json())
  .then((r) => r);

const addItemToCart = (sku) => {
  const product = fetchById(sku);
  console.log(product);
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAddCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAddCart.addEventListener('click', addItemToCart(sku));
  section.appendChild(btnAddCart);

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() {
  createList();
};
