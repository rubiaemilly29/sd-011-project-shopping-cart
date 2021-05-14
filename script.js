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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  const items = document.querySelector('.items');
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
  return event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemsCart = () => {
  const getBtn = document.querySelectorAll('.item__add');
  const getList = document.querySelector('ol.cart__items');
  
  getBtn.forEach((item) => {
    item.addEventListener('click', () => {
      const id = item.parentElement.firstChild.innerText;
      fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((res) => res.json())
      .then((data) => getList.appendChild(createCartItemElement(data)));
    });
  });
};

const myApiPricipal = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((res) => res.json())
    .then((data) => data.results.forEach((product) => createProductItemElement(product)))
    .then(() => addItemsCart())
    .catch((error) => console.log(error));
};

window.onload = function onload() {
myApiPricipal();
};