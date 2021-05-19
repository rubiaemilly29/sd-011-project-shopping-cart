let cartItems;
let itemsContainer;

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const thisElement = event.target;
  cartItems.removeChild(thisElement);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;

  return img;
}

async function addItemToCart(event) {
  const item = event.target.parentNode;
  const singleItemId = getSkuFromProductItem(item);

  const fetchSingleItem = await fetch(`https://api.mercadolibre.com/items/${singleItemId}`);
  const response = await fetchSingleItem.json();
  const singleItemJson = await response;

  const { id, title, price } = singleItemJson;
  const singleItemElement = createCartItemElement({ sku: id, name: title, salePrice: price });

  cartItems.appendChild(singleItemElement);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');

  const addToCartBtn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addToCartBtn.addEventListener('click', addItemToCart);

  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  section.appendChild(addToCartBtn);

  return section;
}

function renderProductsList(productsArray) {
  const itemsSection = document.querySelector('.items');

  productsArray.map((singleProduct) => {
    const { id, title, thumbnail } = singleProduct;

    itemsSection.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));

    return singleProduct;
  });
}

function clearCart() {
  cartItems.innerHTML = '';
}

function createLoadingElement() {
  const loadingElement = document.createElement('div');
  loadingElement.className = 'loading';
  loadingElement.innerText = 'Loading...';
  loadingElement.style.fontSize = '80px';

  return loadingElement;
}

window.onload = async function onload() {
  itemsContainer = document.querySelector('.items');
  cartItems = document.querySelector('.cart__items');
  document.querySelector('.empty-cart').addEventListener('click', clearCart);

  const loadingEl = createLoadingElement();  
  itemsContainer.appendChild(loadingEl);
  
  const fetchML = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const response = await fetchML.json();
  const resultJson = await response;
  const { results } = resultJson;
  
  itemsContainer.removeChild(loadingEl);

  renderProductsList(results);
};
