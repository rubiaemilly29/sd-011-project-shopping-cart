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

const getProductList = (query) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json())
    .then((response) => response.results.forEach((product) => {
      document.querySelector('.items')
        .appendChild(createProductItemElement({
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        }));
    }));
};

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const addItemtoShoppingCart = (event) => {
  const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) return;

  const parentSection = event.target.parentNode;
  const itemId = getSkuFromProductItem(parentSection);
  
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((response) => response.json())
    .then((json) => {
      const olCart = document.querySelector('.cart__items');
      const obj = {
        sku: json.id,
        name: json.title,
        salePrice: json.price,
      };
      olCart.appendChild(createCartItemElement(obj));
    });
};

const items = document.querySelector('.items');
items.addEventListener('click', addItemtoShoppingCart);

window.onload = async () => {
  await getProductList('computador');
};
