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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  const items = document.querySelector('.items');
  items.appendChild(section);

  return section;
}

function mapProducts(products) {
  const allProducts = products.map((results) => {
    const { id, title, thumbnail } = results;

    const product = {
      sku: id,
      name: title,
      image: thumbnail,
    };

    return product;
  });

  allProducts.forEach((product) => createProductItemElement(product));
}

async function fetchProductsList() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador#json';

  try {
    const response = await fetch(url);
    const data = await response.json();
    const products = data.results;

    mapProducts(products);
  } catch (error) {
    throw new Error('Falha ao buscar produtos');
  }
}

window.onload = function onload() {
  fetchProductsList();
};