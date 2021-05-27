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

function cartItemClickListener(event) {
  
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchItem(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((objectResponse) => objectResponse.json())
  .then((objectJson) => {
    const objectCart = {
      sku: objectJson.id, 
      name: objectJson.title,
      salePrice: objectJson.price,
    };
    const itemList = createCartItemElement(objectCart);
    const elementCart = document.getElementsByClassName('cart__items')[0];
    elementCart.appendChild(itemList);
  });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonCreated = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonCreated.addEventListener('click', () => {
    fetchItem(sku);
  });
  section.appendChild(buttonCreated);

  return section;
}

function createProductList() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((json) => {
    json.results.forEach((item) => {
      const objectFinded = { sku: item.id, name: item.title, image: item.thumbnail };
      const items = document.getElementsByClassName('items')[0];
      items.appendChild(createProductItemElement(objectFinded));
    });
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function () {
  createProductList();
};
