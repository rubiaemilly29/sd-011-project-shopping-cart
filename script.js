function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemInCart(item) {
  fetch(`https://api.mercadolibre.com/items/${item}`)
  .then((response) => response.json())
  .then((itemToAdd) => {
    const cart = document.querySelector('.cart__items');
    cart.appendChild(createCartItemElement(itemToAdd));
  });
}
  async function addItemCart(event) {
  const itenToAdd = event.target.parentElement;
  await addItemInCart(getSkuFromProductItem(itenToAdd));
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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addItemCart);
  return section;
}

const getMlComputers = (query) => {
  const sectionItens = document.querySelector('.items');
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => response.json())
  .then((data) => {
    data.results.forEach((product) => {
    const productProperties = { sku: product.id, name: product.title, image: product.thumbnail };
    sectionItens.appendChild(createProductItemElement(productProperties));
  });
});
};
window.onload = async () => {
  await getMlComputers('computador');
}; 