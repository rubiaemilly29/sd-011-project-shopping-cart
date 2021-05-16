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

async function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  console.log(sku, name, salePrice);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchProduct(event) {
  const sku = event.path[1].querySelector('.item__sku').innerText;
  const itemUrl = `https://api.mercadolibre.com/items/${sku}`;
  try {
    const result = await fetch(itemUrl);
    const data = await result.json();
    const { id, title, price } = data;
    const product = { sku: id, name: title, salePrice: price };

    const list = document.querySelector('.cart__items');
    list.appendChild(createCartItemElement(product));
  } catch (error) {
    throw new Error('Não foi possível encontrar o produto');
  }
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

function mapProducts(products) {
  const allProducts = products.map((results) => {
    const { id, title, thumbnail, price } = results;

    const product = {
      sku: id,
      name: title,
      image: thumbnail,
    };

    return product;
  });

  return allProducts;
}

async function fetchProductsList() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador#json';

  const response = await fetch(url);
  const data = await response.json();
  const products = await data.results;

  return mapProducts(products);
}

window.onload = async function onload() {
  try {
    const allProducts = await fetchProductsList();

    allProducts.forEach((product) => {
      const items = document.querySelector('.items');
      items.appendChild(createProductItemElement(product));
    });
    const addButton = document.querySelectorAll('.item__add');
    addButton.forEach((button) => {
      button.addEventListener('click', fetchProduct);
    });
  } catch (error) {
    throw new Error('Falha ao buscar produtos');
  }
};