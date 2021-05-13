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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
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

async function addItemToCart(event) {
  const sku = getSkuFromProductItem(event.target.parentElement);

  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const { title, price } = await response.json();

  const cartItemElement = createCartItemElement({ sku, name: title, salePrice: price });
  document.querySelector('.cart__items').appendChild(cartItemElement);
}

window.onload = async function onload() {
  const itemsSection = document.querySelector('section .items');

  const queryName = 'computador';  

  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${queryName}`);
  const { results } = await response.json();

  results.forEach((product) => {
    const component = createProductItemElement({
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    });
    itemsSection.appendChild(component);
  });

  const addButtons = document.querySelectorAll('.item__add');
  addButtons.forEach((element) => element.addEventListener('click', addItemToCart));
};
