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

const removeIdStorange = (eventTarget) => {
  const id = eventTarget.innerText.slice(5, 18);

  localStorage.removeItem(id);
};

function cartItemClickListener(event) {
  const isLi = event.target.nodeName === 'LI';
  if (!isLi) return;

  removeIdStorange(event.target);

  event.target.remove();
}

const olCart = document.querySelector('.cart__items');
olCart.addEventListener('click', cartItemClickListener);

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

const addItemtoShoppingCart = (itemId) => {
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((response) => response.json())
  .then((json) => {
    const obj = {
      sku: json.id,
      name: json.title,
      salePrice: json.price,
    };
    olCart.appendChild(createCartItemElement(obj));
  });
};

const findClickAddItemCart = (event) => {
  const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) return;

  const parentSection = event.target.parentNode;
  const itemId = getSkuFromProductItem(parentSection);

  localStorage.setItem(itemId, itemId);

  addItemtoShoppingCart(itemId);
};

const items = document.querySelector('.items');
items.addEventListener('click', findClickAddItemCart);

const localStorageItemsCart = (idArr) => {
  idArr.forEach((id) => addItemtoShoppingCart(id));
};

window.onload = async () => {
  await getProductList('computador');
  await localStorageItemsCart(Object.keys(localStorage));
};
