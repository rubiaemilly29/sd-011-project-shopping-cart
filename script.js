function getProductListing(queryTerm) {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${queryTerm}`;

  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      resolve(json.results);
    } catch (e) {
      reject(e);
    }
  })  
}

function getProductDetails(productId) {
  const url = `https://api.mercadolibre.com/items/${productId}`;

  return new Promise((resolve, reject) => {
    fetch(url)
    .then((response) => response.json())
    .then((json) => resolve(json))
    .catch((e) => reject(e));
  })
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText, eventListener) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  if (eventListener) {
    e.addEventListener('click', eventListener);
  }
  return e;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function handleAddItemToCart(e) {
  const id = getSkuFromProductItem(e.target.parentElement);
  const cartItemsContainer = document.querySelector('.cart__items');
  getProductDetails(id)
  .then(({id, title, price}) => createCartItemElement({sku: id, name: title, salePrice: price}))
  .then((cartItemElement) => cartItemsContainer.appendChild(cartItemElement))
  .catch((e) => console.error(e));
}

function cartItemClickListener(e) {
  e.target.remove();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', handleAddItemToCart));

  return section;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = async function onload() {
  const itemsContainer = document.querySelector('.items');
  const itemList = await getProductListing('computador');
  itemList.forEach(({id, title, thumbnail}) => {
    const itemElement = createProductItemElement({sku: id, name: title, image: thumbnail});
    itemsContainer.appendChild(itemElement);
  });
};
