window.onload = async function onload() {
  ALL_PRODUCTS();

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

function createProductItemElement(sku, name, image) {
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
  let cart = document.querySelector('.cart__items');
  cart.removeChild(event.target)
}

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemToCart(event) {
  let cart = document.querySelector('.cart__items');

  const ITEM = event.path[1].children[0].innerText;
  const itemInfo = await fetch(`https://api.mercadolibre.com/items/${ITEM}`);
  const data = await itemInfo.json();
  cart.appendChild(createCartItemElement(data.id, data.title, data.price));
}

const ALL_PRODUCTS = async () => {
  const productsContainer = document.querySelector('.items')

  const QUERY = 'computador';
  const data = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
  const allProducts = await data.json();

  //create element HTML for each product
  allProducts.results.forEach((product) => {
    const section = document.createElement('section');
    section.className = 'item';
    productsContainer.appendChild(
      createProductItemElement(product.id, product.title, product.thumbnail)
    );
  })
  const addToCartButton = document.querySelectorAll('button.item__add');
  addToCartButton.forEach((button) => button.addEventListener('click', addItemToCart))
}
