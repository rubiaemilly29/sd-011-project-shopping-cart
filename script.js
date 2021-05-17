function toggleLoadingElement(isLoading) {
  if (!isLoading) {
    document.querySelector('.loading').remove();
    return;
  }
  const loadingText = document.createElement('h2');
  loadingText.innerHTML = 'Loading...';
  loadingText.className = 'loading';
  document.querySelector('body').appendChild(loadingText);
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

let sumAccumulator = 0;
function sumSalePrice(salePrice) {
  sumAccumulator += salePrice;
  document.querySelector('strong.total-price').innerText = sumAccumulator;
}

function subtractSalePrice(salePrice) {
  sumAccumulator -= salePrice;
  document.querySelector('strong.total-price').innerText = sumAccumulator;
}

async function cartItemClickListener(event) {
  const itemStoraged = localStorage.getItem(event.target.id);
  const itemInfoArray = itemStoraged.split('\\');
  subtractSalePrice(parseFloat(itemInfoArray[2]));

  localStorage.removeItem(event.target.id);
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.id = sku;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  localStorage.setItem(sku, `${sku}\\${name}\\${salePrice}`);
  const list = document.querySelector('.cart__items');
  list.appendChild(li);
  return li;
}

async function fetchProduct(event) {
  const sku = event.path[1].querySelector('.item__sku').innerText;
  const itemUrl = `https://api.mercadolibre.com/items/${sku}`;

  const result = await fetch(itemUrl);
  const data = await result.json();
  const { id, title, price } = data;
  const product = { sku: id, name: title, salePrice: price };

  createCartItemElement(product);
  sumSalePrice(product.salePrice);
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
    const { id, title, thumbnail } = results;

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

  toggleLoadingElement(false);
  return mapProducts(products);
}

function getStorage() {
  const storageArray = Object.values(localStorage);
  storageArray.forEach((element) => {
    const newElement = element.split('\\');
    const product = {
      sku: newElement[0],
      name: newElement[1],
      salePrice: parseFloat(newElement[2]),
    };
    createCartItemElement(product);
  });
}

function clearShoppingCart() {
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((item) => item.parentNode.removeChild(item));
  localStorage.clear();
}

window.onload = async function onload() {
  toggleLoadingElement(true);
  getStorage();

  try {
    const allProducts = await fetchProductsList();
    allProducts.forEach((product) => {
      const items = document.querySelector('.items');
      items.appendChild(createProductItemElement(product));
    });

    const addButton = document.querySelectorAll('.item__add');
    addButton.forEach((button) => button.addEventListener('click', fetchProduct));

    const clearAllButton = document.querySelector('.empty-cart');
    clearAllButton.addEventListener('click', clearShoppingCart);
  } catch (error) {
    throw new Error('Falha ao buscar produtos');
  }
};