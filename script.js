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
  const items = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';
  items.appendChild(section);
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

}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getEndPoint = (query) => {
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  fetch(endpoint)
    .then((response) => response.json())
    .then((object) => {
      const result = object.results;
      result.forEach((item) => {
        createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        });
      });
    })
    .catch((error) => {
      window.alert(error);
    });
};

window.onload = function onload() {
  // cartItemClickListener();
  // createProductItemElement();
  // createCartItemElement();
  getEndPoint('computador');
};